import { PermissionFlagsBits } from "discord.js";
import { prisma } from "../../../utils/apiUtils/prismaUtils/prisma";
import { discordApiFetch } from "./discordApiFetch";

type DiscordPartialGuild = {
  id: string;
  name: string;
  owner?: boolean;
  permissions?: string;
  approximate_member_count?: number;
};

type DiscordGuildDetails = {
  id: string;
  name: string;
  owner_id: string;
  approximate_member_count?: number;
};

type DiscordUser = {
  id: string;
  username: string;
  global_name?: string | null;
  discriminator?: string;
};

type DiscordChannel = {
  id: string;
  name?: string;
  type: number;
};

export type DiscordGuildAuditRow = {
  discordGuildId: string;
  name: string;
  memberCount: number | null;
  ownerId: string | null;
  ownerUsername: string | null;
  ownerNote: string;
  botConnected: boolean;
  botPermissionsRaw: string | null;
  hasAdministrator: boolean | null;
  hasManageGuild: boolean | null;
  hasManageMessages: boolean | null;
  hasManageChannels: boolean | null;
  hasViewChannel: boolean | null;
  hasSendMessages: boolean | null;
  hasReadMessageHistory: boolean | null;
  visibleChannels: { id: string; name: string; type: number }[] | null;
  inDatabase: boolean;
  dbGuildId: number | null;
  dbName: string | null;
  dbChannelCount: number | null;
  dbRoleCount: number | null;
  dbHasCurrency: boolean | null;
  dbHasRoleplayConfig: boolean | null;
  lastRecordedActivityAt: string | null;
  notes: string[];
};

const hasPermission = (
  permissions: string | undefined,
  flag: bigint,
): boolean | null => {
  if (permissions == null || permissions === "") return null;
  try {
    return (BigInt(permissions) & flag) === flag;
  } catch {
    return null;
  }
};

const formatOwnerUsername = (user: DiscordUser): string => {
  if (user.global_name) return `${user.global_name} (@${user.username})`;
  if (user.discriminator && user.discriminator !== "0") {
    return `${user.username}#${user.discriminator}`;
  }
  return user.username;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runDiscordGuildAudit = async (): Promise<{
  generatedAt: string;
  ownerFieldMeaning: string;
  guilds: DiscordGuildAuditRow[];
  dbOnlyGuilds: {
    dbGuildId: number;
    discordGuildId: string;
    name: string;
    note: string;
  }[];
}> => {
  const installed = await discordApiFetch<DiscordPartialGuild[]>(
    "/users/@me/guilds?with_counts=true",
  );

  const dbGuilds = await prisma.guild.findMany({
    include: {
      guildChannels: { select: { id: true } },
      guildRoles: { select: { id: true } },
      guildCurrencies: { select: { id: true } },
      aiRoleplayConfig: { select: { guildId: true } },
      imageCoinPayouts: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      boostClaims: {
        select: { claimedAt: true },
        orderBy: { claimedAt: "desc" },
        take: 1,
      },
      roleplaySessions: {
        select: { updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });

  const dbByDiscordId = new Map(dbGuilds.map((g) => [g.discordId, g]));
  const rows: DiscordGuildAuditRow[] = [];

  for (const partial of installed) {
    const notes: string[] = [];
    const db = dbByDiscordId.get(partial.id);

    let ownerId: string | null = null;
    let ownerUsername: string | null = null;
    let memberCount: number | null =
      partial.approximate_member_count ?? null;
    let visibleChannels: DiscordGuildAuditRow["visibleChannels"] = null;

    try {
      const details = await discordApiFetch<DiscordGuildDetails>(
        `/guilds/${partial.id}?with_counts=true`,
      );
      ownerId = details.owner_id;
      if (details.approximate_member_count != null) {
        memberCount = details.approximate_member_count;
      }
    } catch (error) {
      notes.push(
        `Could not fetch guild details: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (ownerId) {
      try {
        const owner = await discordApiFetch<DiscordUser>(`/users/${ownerId}`);
        ownerUsername = formatOwnerUsername(owner);
      } catch (error) {
        notes.push(
          `Could not fetch owner user: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    try {
      const channels = await discordApiFetch<DiscordChannel[]>(
        `/guilds/${partial.id}/channels`,
      );
      visibleChannels = channels
        .filter((channel) => channel.name)
        .map((channel) => ({
          id: channel.id,
          name: channel.name as string,
          type: channel.type,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      notes.push(
        `Could not list channels: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const activityDates = [
      db?.imageCoinPayouts[0]?.createdAt,
      db?.boostClaims[0]?.claimedAt,
      db?.roleplaySessions[0]?.updatedAt,
    ].filter((value): value is Date => value instanceof Date);

    const lastRecordedActivityAt =
      activityDates.length > 0
        ? new Date(Math.max(...activityDates.map((d) => d.getTime()))).toISOString()
        : null;

    if (!db) {
      notes.push("Bot is installed in Discord but this guild is not in the admin database.");
    }

    rows.push({
      discordGuildId: partial.id,
      name: partial.name,
      memberCount,
      ownerId,
      ownerUsername,
      ownerNote:
        "ownerId/ownerUsername are the current Discord server owner, not necessarily who invited the bot.",
      botConnected: true,
      botPermissionsRaw: partial.permissions ?? null,
      hasAdministrator: hasPermission(
        partial.permissions,
        PermissionFlagsBits.Administrator,
      ),
      hasManageGuild: hasPermission(
        partial.permissions,
        PermissionFlagsBits.ManageGuild,
      ),
      hasManageMessages: hasPermission(
        partial.permissions,
        PermissionFlagsBits.ManageMessages,
      ),
      hasManageChannels: hasPermission(
        partial.permissions,
        PermissionFlagsBits.ManageChannels,
      ),
      hasViewChannel: hasPermission(
        partial.permissions,
        PermissionFlagsBits.ViewChannel,
      ),
      hasSendMessages: hasPermission(
        partial.permissions,
        PermissionFlagsBits.SendMessages,
      ),
      hasReadMessageHistory: hasPermission(
        partial.permissions,
        PermissionFlagsBits.ReadMessageHistory,
      ),
      visibleChannels,
      inDatabase: Boolean(db),
      dbGuildId: db?.id ?? null,
      dbName: db?.name ?? null,
      dbChannelCount: db ? db.guildChannels.length : null,
      dbRoleCount: db ? db.guildRoles.length : null,
      dbHasCurrency: db ? db.guildCurrencies.length > 0 : null,
      dbHasRoleplayConfig: db ? db.aiRoleplayConfig != null : null,
      lastRecordedActivityAt,
      notes,
    });

    // Be gentle on Discord rate limits when many guilds exist.
    await sleep(250);
  }

  const installedIds = new Set(installed.map((g) => g.id));
  const dbOnlyGuilds = dbGuilds
    .filter((g) => !installedIds.has(g.discordId))
    .map((g) => ({
      dbGuildId: g.id,
      discordGuildId: g.discordId,
      name: g.name,
      note: "Configured in the database, but the bot is not currently in this Discord server (or cannot see it).",
    }));

  return {
    generatedAt: new Date().toISOString(),
    ownerFieldMeaning:
      "Server owner fields identify the current Discord guild owner. They do not identify who originally invited the bot, and they are not a full admin list.",
    guilds: rows.sort((a, b) => a.name.localeCompare(b.name)),
    dbOnlyGuilds,
  };
};
