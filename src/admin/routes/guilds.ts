import { Response, Router } from "express";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import { isNonEmptyString } from "../../utils/string/isNonEmptyString";
import { parseId } from "../../utils/string/parseId";
import {
  CHANNEL_SLOT_NAMES,
  ROLE_SLOT_NAMES,
} from "../slotNames";
import { isChannelSlotName } from "../utils/isChannelSlotName";
import { isRoleSlotName } from "../utils/isRoleSlotName";
import { fetchGuildDiscordResources } from "../utils/discord/fetchGuildDiscordResources";
import {
  getUnmappedSlots,
  suggestSlotMappings,
} from "../utils/discord/suggestSlotMappings";
import { upsertGuildChannels } from "../utils/upsertGuildChannels";
import { upsertGuildRoles } from "../utils/upsertGuildRoles";
import { deleteGuildWithRelations } from "../utils/deleteGuildWithRelations";

export const guildsRouter = Router();

const mapSlots = <T extends { name: string; discordId: string; id: number }>(
  rows: T[],
  slotNames: readonly string[],
) =>
  slotNames.map((name) => {
    const row = rows.find((r) => r.name === name);
    return {
      id: row?.id ?? null,
      name,
      discordId: row?.discordId ?? "",
    };
  });

const mapRoleSlots = (
  rows: {
    id: number;
    name: string;
    discordId: string;
    imageLimit: number | null;
  }[],
  slotNames: readonly string[],
) =>
  slotNames.map((name) => {
    const row = rows.find((r) => r.name === name);
    return {
      id: row?.id ?? null,
      name,
      discordId: row?.discordId ?? "",
      imageLimit: row?.imageLimit ?? null,
    };
  });

const getGuildOr404 = async (guildId: number, res: Response) => {
  const guild = await prisma.guild.findUnique({ where: { id: guildId } });
  if (!guild) {
    res.status(404).json({ error: "Guild not found" });
    return null;
  }
  return guild;
};

guildsRouter.get("/", async (_req, res) => {
  const guilds = await prisma.guild.findMany({
    select: { id: true, name: true, discordId: true },
    orderBy: { name: "asc" },
  });
  res.json({ guilds });
});

guildsRouter.post("/", async (req, res) => {
  const { discordId, name } = req.body as {
    discordId?: string;
    name?: string;
  };

  if (!isNonEmptyString(discordId) || !isNonEmptyString(name)) {
    res.status(400).json({ error: "discordId and name are required" });
    return;
  }

  try {
    const guild = await prisma.guild.create({
      data: {
        discordId: discordId.trim(),
        name: name.trim(),
      },
    });
    res.status(201).json({ guild });
  } catch {
    res.status(409).json({ error: "Guild discordId already exists" });
  }
});

guildsRouter.get("/:id", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: {
      guildChannels: true,
      guildRoles: true,
      guildCurrencies: true,
      guildRemovalReasons: { orderBy: { id: "asc" } },
    },
  });

  if (!guild) {
    res.status(404).json({ error: "Guild not found" });
    return;
  }

  res.json({
    guild: {
      id: guild.id,
      discordId: guild.discordId,
      name: guild.name,
    },
    channels: mapSlots(guild.guildChannels, CHANNEL_SLOT_NAMES),
    roles: mapRoleSlots(guild.guildRoles, ROLE_SLOT_NAMES),
    currency: guild.guildCurrencies[0] ?? null,
    removalReasons: guild.guildRemovalReasons,
  });
});

guildsRouter.get("/:id/discord-resources", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  try {
    const discordResources = await fetchGuildDiscordResources(guild.discordId);
    const [dbChannels, dbRoles] = await Promise.all([
      prisma.guildChannel.findMany({ where: { guildId } }),
      prisma.guildRole.findMany({ where: { guildId } }),
    ]);

    const suggestedChannels = suggestSlotMappings(
      CHANNEL_SLOT_NAMES,
      discordResources.channels,
      dbChannels,
    );
    const suggestedRoles = suggestSlotMappings(
      ROLE_SLOT_NAMES,
      discordResources.roles,
      dbRoles,
    );

    res.json({
      discord: discordResources,
      suggestedChannels,
      suggestedRoles,
      missingChannels: getUnmappedSlots(CHANNEL_SLOT_NAMES, suggestedChannels),
      missingRoles: getUnmappedSlots(ROLE_SLOT_NAMES, suggestedRoles),
    });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : "Failed to fetch from Discord",
    });
  }
});

guildsRouter.post("/:id/discord-sync", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { channels, roles } = req.body as {
    channels?: Record<string, string>;
    roles?: Record<string, string>;
  };

  if (!channels || typeof channels !== "object") {
    res.status(400).json({ error: "channels object is required" });
    return;
  }

  if (!roles || typeof roles !== "object") {
    res.status(400).json({ error: "roles object is required" });
    return;
  }

  try {
    await upsertGuildChannels(guildId, channels);
    await upsertGuildRoles(guildId, roles);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to sync mappings",
    });
    return;
  }

  const [savedChannels, savedRoles] = await Promise.all([
    prisma.guildChannel.findMany({ where: { guildId } }),
    prisma.guildRole.findMany({ where: { guildId } }),
  ]);

  const channelMappings = mapSlots(savedChannels, CHANNEL_SLOT_NAMES).reduce<
    Record<string, string>
  >((acc, row) => {
    acc[row.name] = row.discordId;
    return acc;
  }, {});

  const roleMappings = mapSlots(savedRoles, ROLE_SLOT_NAMES).reduce<
    Record<string, string>
  >((acc, row) => {
    acc[row.name] = row.discordId;
    return acc;
  }, {});

  res.json({
    channels: mapSlots(savedChannels, CHANNEL_SLOT_NAMES),
    roles: mapRoleSlots(savedRoles, ROLE_SLOT_NAMES),
    missingChannels: getUnmappedSlots(CHANNEL_SLOT_NAMES, channelMappings),
    missingRoles: getUnmappedSlots(ROLE_SLOT_NAMES, roleMappings),
  });
});

guildsRouter.patch("/:id", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { discordId, name } = req.body as {
    discordId?: string;
    name?: string;
  };

  const data: { discordId?: string; name?: string } = {};
  if (discordId !== undefined) {
    if (!isNonEmptyString(discordId)) {
      res.status(400).json({ error: "discordId cannot be empty" });
      return;
    }
    data.discordId = discordId.trim();
  }
  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      res.status(400).json({ error: "name cannot be empty" });
      return;
    }
    data.name = name.trim();
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const updated = await prisma.guild.update({
      where: { id: guildId },
      data,
    });
    res.json({ guild: updated });
  } catch {
    res.status(409).json({ error: "Guild discordId already exists" });
  }
});

guildsRouter.delete("/:id", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  await deleteGuildWithRelations(guildId);

  res.json({ ok: true });
});

guildsRouter.put("/:id/channels", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { slots } = req.body as { slots?: Record<string, string> };
  if (!slots || typeof slots !== "object") {
    res.status(400).json({ error: "slots object is required" });
    return;
  }

  try {
    await upsertGuildChannels(guildId, slots);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to save channels",
    });
    return;
  }

  const channels = await prisma.guildChannel.findMany({ where: { guildId } });
  res.json({ channels: mapSlots(channels, CHANNEL_SLOT_NAMES) });
});

guildsRouter.delete("/:id/channels/:slotName", async (req, res) => {
  const guildId = parseId(req.params.id);
  const slotName = req.params.slotName;

  if (!guildId || !isChannelSlotName(slotName)) {
    res.status(400).json({ error: "Invalid guild id or channel slot" });
    return;
  }

  const existing = await prisma.guildChannel.findFirst({
    where: { guildId, name: slotName },
  });

  if (existing) {
    await prisma.guildChannel.delete({ where: { id: existing.id } });
  }

  res.json({ ok: true });
});

guildsRouter.put("/:id/roles", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { slots, imageLimits } = req.body as {
    slots?: Record<string, string>;
    imageLimits?: Record<string, number | null>;
  };
  if (!slots || typeof slots !== "object") {
    res.status(400).json({ error: "slots object is required" });
    return;
  }

  try {
    await upsertGuildRoles(guildId, slots, imageLimits ?? {});
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to save roles",
    });
    return;
  }

  const roles = await prisma.guildRole.findMany({ where: { guildId } });
  res.json({ roles: mapRoleSlots(roles, ROLE_SLOT_NAMES) });
});

guildsRouter.delete("/:id/roles/:slotName", async (req, res) => {
  const guildId = parseId(req.params.id);
  const slotName = req.params.slotName;

  if (!guildId || !isRoleSlotName(slotName)) {
    res.status(400).json({ error: "Invalid guild id or role slot" });
    return;
  }

  const existing = await prisma.guildRole.findFirst({
    where: { guildId, name: slotName },
  });

  if (existing) {
    await prisma.guildRole.delete({ where: { id: existing.id } });
  }

  res.json({ ok: true });
});

guildsRouter.put("/:id/currency", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { name, namePlural, iconSrc } = req.body as {
    name?: string;
    namePlural?: string;
    iconSrc?: string;
  };

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(namePlural) ||
    !isNonEmptyString(iconSrc)
  ) {
    res.status(400).json({ error: "name, namePlural, and iconSrc are required" });
    return;
  }

  const existing = await prisma.guildCurrency.findFirst({ where: { guildId } });
  const data = {
    name: name.trim(),
    namePlural: namePlural.trim(),
    iconSrc: iconSrc.trim(),
  };

  const currency = existing
    ? await prisma.guildCurrency.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.guildCurrency.create({
        data: { guildId, ...data },
      });

  res.json({ currency });
});

guildsRouter.post("/:id/removal-reasons", async (req, res) => {
  const guildId = parseId(req.params.id);
  if (!guildId) {
    res.status(400).json({ error: "Invalid guild id" });
    return;
  }

  const guild = await getGuildOr404(guildId, res);
  if (!guild) return;

  const { title, description, value } = req.body as {
    title?: string;
    description?: string;
    value?: string;
  };

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(description) ||
    !isNonEmptyString(value)
  ) {
    res
      .status(400)
      .json({ error: "title, description, and value are required" });
    return;
  }

  const reason = await prisma.guildRemovalReason.create({
    data: {
      guildId,
      title: title.trim(),
      description: description.trim(),
      value: value.trim(),
    },
  });

  res.status(201).json({ reason });
});

guildsRouter.patch("/:id/removal-reasons/:reasonId", async (req, res) => {
  const guildId = parseId(req.params.id);
  const reasonId = parseId(req.params.reasonId);

  if (!guildId || !reasonId) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const existing = await prisma.guildRemovalReason.findFirst({
    where: { id: reasonId, guildId },
  });

  if (!existing) {
    res.status(404).json({ error: "Removal reason not found" });
    return;
  }

  const { title, description, value } = req.body as {
    title?: string;
    description?: string;
    value?: string;
  };

  const data: { title?: string; description?: string; value?: string } = {};
  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      res.status(400).json({ error: "title cannot be empty" });
      return;
    }
    data.title = title.trim();
  }
  if (description !== undefined) {
    if (!isNonEmptyString(description)) {
      res.status(400).json({ error: "description cannot be empty" });
      return;
    }
    data.description = description.trim();
  }
  if (value !== undefined) {
    if (!isNonEmptyString(value)) {
      res.status(400).json({ error: "value cannot be empty" });
      return;
    }
    data.value = value.trim();
  }

  const reason = await prisma.guildRemovalReason.update({
    where: { id: reasonId },
    data,
  });

  res.json({ reason });
});

guildsRouter.delete("/:id/removal-reasons/:reasonId", async (req, res) => {
  const guildId = parseId(req.params.id);
  const reasonId = parseId(req.params.reasonId);

  if (!guildId || !reasonId) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const existing = await prisma.guildRemovalReason.findFirst({
    where: { id: reasonId, guildId },
  });

  if (!existing) {
    res.status(404).json({ error: "Removal reason not found" });
    return;
  }

  await prisma.guildRemovalReason.delete({ where: { id: reasonId } });
  res.json({ ok: true });
});
