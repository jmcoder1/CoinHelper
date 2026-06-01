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
    roles: mapSlots(guild.guildRoles, ROLE_SLOT_NAMES),
    currency: guild.guildCurrencies[0] ?? null,
    removalReasons: guild.guildRemovalReasons,
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

  await prisma.guildRole.deleteMany({ where: { guildId } });
  await prisma.guildChannel.deleteMany({ where: { guildId } });
  await prisma.guildCurrency.deleteMany({ where: { guildId } });
  await prisma.guildRemovalReason.deleteMany({ where: { guildId } });
  await prisma.guild.delete({ where: { id: guildId } });

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

  for (const [name, discordId] of Object.entries(slots)) {
    if (!isChannelSlotName(name)) {
      res.status(400).json({ error: `Unknown channel slot: ${name}` });
      return;
    }

    const trimmedId = typeof discordId === "string" ? discordId.trim() : "";
    const existing = await prisma.guildChannel.findFirst({
      where: { guildId, name },
    });

    if (!trimmedId) {
      if (existing) {
        await prisma.guildChannel.delete({ where: { id: existing.id } });
      }
      continue;
    }

    if (existing) {
      await prisma.guildChannel.update({
        where: { id: existing.id },
        data: { discordId: trimmedId },
      });
    } else {
      await prisma.guildChannel.create({
        data: { guildId, name, discordId: trimmedId },
      });
    }
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

  const { slots } = req.body as { slots?: Record<string, string> };
  if (!slots || typeof slots !== "object") {
    res.status(400).json({ error: "slots object is required" });
    return;
  }

  for (const [name, discordId] of Object.entries(slots)) {
    if (!isRoleSlotName(name)) {
      res.status(400).json({ error: `Unknown role slot: ${name}` });
      return;
    }

    const trimmedId = typeof discordId === "string" ? discordId.trim() : "";
    const existing = await prisma.guildRole.findFirst({
      where: { guildId, name },
    });

    if (!trimmedId) {
      if (existing) {
        await prisma.guildRole.delete({ where: { id: existing.id } });
      }
      continue;
    }

    if (existing) {
      await prisma.guildRole.update({
        where: { id: existing.id },
        data: { discordId: trimmedId },
      });
    } else {
      await prisma.guildRole.create({
        data: { guildId, name, discordId: trimmedId },
      });
    }
  }

  const roles = await prisma.guildRole.findMany({ where: { guildId } });
  res.json({ roles: mapSlots(roles, ROLE_SLOT_NAMES) });
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
