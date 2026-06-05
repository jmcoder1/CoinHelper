import { Client, Message } from "discord.js";
import {
  PENDING_STATUS_AWAIT_PARTNER,
  PENDING_STATUS_PICK_PARTNER,
} from "./constants";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildDuoInviteComponents } from "./discord/buildDuoInviteComponents";
import { buildDuoInviteMessage } from "./discord/buildDuoInviteMessage";
import { extractFirstMentionedUserId } from "./discord/extractFirstMentionedUserId";
import { notifyReactorWithComponents } from "./discord/notifyReactorWithComponents";
import { extendPendingStartExpiry } from "./sessions/extendPendingStartExpiry";
import { getPartnerPickPendingStart } from "./sessions/getPartnerPickPendingStart";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayDmHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayDm = async (
  client: Client,
  message: Message,
): Promise<boolean> => {
  if (!deps) return false;
  if (!message.channel.isDMBased()) return false;
  if (message.author.bot) return false;

  const pending = await getPartnerPickPendingStart(
    deps.prisma,
    message.author.id,
  );
  if (!pending) return false;

  const partnerId = extractFirstMentionedUserId(message, message.author.id);
  if (!partnerId) {
    await message.reply(
      "Reply with a message that @mentions one server member you want to duo roleplay with.",
    );
    return true;
  }

  const guild = await deps.prisma.guild.findUnique({
    where: { id: pending.guildId },
  });
  if (!guild) return true;

  const discordGuild = await client.guilds.fetch(guild.discordId).catch(() => null);
  if (!discordGuild) {
    await message.reply("That server could not be found. React again to retry.");
    return true;
  }

  const member = await discordGuild.members.fetch(partnerId).catch(() => null);
  if (!member) {
    await message.reply(
      "That user must be a member of the server. @mention someone in the server.",
    );
    return true;
  }

  const config = await loadGuildRoleplayConfig(deps.prisma, guild.discordId);
  if (!isRoleplayConfigComplete(config)) {
    await message.reply("AI roleplay is not configured for this server.");
    return true;
  }

  await extendPendingStartExpiry(deps.prisma, pending.id);
  await deps.prisma.roleplayPendingStart.update({
    where: { id: pending.id },
    data: {
      partnerId,
      status: PENDING_STATUS_AWAIT_PARTNER,
    },
  });

  const partner = await client.users.fetch(partnerId);
  const inviteSent = await notifyReactorWithComponents(
    partner,
    buildDuoInviteMessage(pending.initiatorId, pending.sourceMessageUrl),
    buildDuoInviteComponents(pending.id),
  );

  if (!inviteSent) {
    await deps.prisma.roleplayPendingStart.update({
      where: { id: pending.id },
      data: { partnerId: null, status: PENDING_STATUS_PICK_PARTNER },
    });
    await message.reply(
      "I couldn't DM that user. They may need to enable DMs from server members. Try someone else or react again.",
    );
    return true;
  }

  await message.reply(
    `Invite sent to <@${partnerId}>. Waiting for them to accept (10 minutes).`,
  );

  return true;
};
