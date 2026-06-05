import { ButtonInteraction, Client } from "discord.js";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildGeneratingMessage } from "./discord/buildGeneratingMessage";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildPendingStartExpiredMessage } from "./discord/buildPendingStartExpiredMessage";
import { disableMessageButtons } from "./discord/disableMessageButtons";
import { parseRolePickButtonId } from "./discord/parseRolePickButtonId";
import { executeRoleplayStart } from "./executeRoleplayStart";
import { deleteRoleplayPendingStart } from "./sessions/deleteRoleplayPendingStart";
import { getRoleplayPendingStart } from "./sessions/getRoleplayPendingStart";
import { isSessionExpired } from "./sessions/isSessionExpired";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayRolePickHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayRolePick = async (
  client: Client,
  interaction: ButtonInteraction,
): Promise<boolean> => {
  if (!deps) return false;

  const buttonData = parseRolePickButtonId(interaction.customId);
  if (!buttonData) return false;

  const pending = await getRoleplayPendingStart(deps.prisma, buttonData.pendingId);
  if (!pending) {
    await interaction.reply({
      content: buildPendingStartExpiredMessage(),
    });
    return true;
  }

  if (isSessionExpired(pending.expiresAt)) {
    await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);
    await interaction.reply({
      content: buildPendingStartExpiredMessage(),
    });
    return true;
  }

  if (interaction.user.id !== pending.initiatorId) {
    await interaction.reply({
      content: "Only the person who reacted can pick a role for this roleplay.",
    });
    return true;
  }

  const guild = await deps.prisma.guild.findUnique({
    where: { id: pending.guildId },
  });
  if (!guild) {
    await interaction.reply({
      content: buildNotConfiguredMessage(),
    });
    return true;
  }

  const config = await loadGuildRoleplayConfig(deps.prisma, guild.discordId);
  if (!isRoleplayConfigComplete(config)) {
    await interaction.reply({
      content: buildNotConfiguredMessage(),
    });
    return true;
  }

  const selectedRole = config.roleplayRoles[buttonData.roleIndex];
  if (!selectedRole) {
    await interaction.reply({
      content: "That role is no longer available.",
    });
    return true;
  }

  await interaction.update({
    content: buildGeneratingMessage(),
    components: [],
  });

  const sourceAuthor = await client.users.fetch(pending.sourceAuthorId);

  await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);

  if (interaction.message.inGuild()) {
    await disableMessageButtons(interaction.message);
  }

  await executeRoleplayStart(client, deps, config, {
    guildId: pending.guildId,
    sourceMessageId: pending.sourceMessageId,
    sourceChannelId: pending.sourceChannelId,
    sourceAuthorId: pending.sourceAuthorId,
    sourceAuthorUsername: sourceAuthor.username,
    sourceAuthorAvatarUrl: sourceAuthor.avatarURL() ?? undefined,
    initiatorId: pending.initiatorId,
    initiator: interaction.user,
    sourceMessageUrl: pending.sourceMessageUrl,
    sourceCaption: pending.sourceCaption,
    sourceImageUrl: pending.sourceImageUrl,
    selectedRoleId: selectedRole.id,
    selectedRoleLabel: selectedRole.label,
    selectedRolePrompt: selectedRole.prompt,
  });

  return true;
};
