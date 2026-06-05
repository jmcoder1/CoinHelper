import { ButtonInteraction, Client } from "discord.js";
import {
  PENDING_START_TTL_MS,
  PENDING_STATUS_PICK_PARTNER,
  PENDING_STATUS_PICK_ROLE,
  ROLEPLAY_MODE_DUO,
  ROLEPLAY_MODE_SOLO,
} from "./constants";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildDuoPartnerPromptMessage } from "./discord/buildDuoPartnerPromptMessage";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildPendingStartExpiredMessage } from "./discord/buildPendingStartExpiredMessage";
import { buildPickRoleMessage } from "./discord/buildPickRoleMessage";
import { buildRolePickComponents } from "./discord/buildRolePickComponents";
import { disableMessageButtons } from "./discord/disableMessageButtons";
import { notifyReactorWithComponents } from "./discord/notifyReactorWithComponents";
import { parseModePickButtonId } from "./discord/parseModePickButtonId";
import { deleteRoleplayPendingStart } from "./sessions/deleteRoleplayPendingStart";
import { extendPendingStartExpiry } from "./sessions/extendPendingStartExpiry";
import { getRoleplayPendingStart } from "./sessions/getRoleplayPendingStart";
import { isSessionExpired } from "./sessions/isSessionExpired";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayModePickHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayModePick = async (
  _client: Client,
  interaction: ButtonInteraction,
): Promise<boolean> => {
  if (!deps) return false;

  const buttonData = parseModePickButtonId(interaction.customId);
  if (!buttonData) return false;

  const pending = await getRoleplayPendingStart(deps.prisma, buttonData.pendingId);
  if (!pending) {
    await interaction.reply({ content: buildPendingStartExpiredMessage() });
    return true;
  }

  if (isSessionExpired(pending.expiresAt)) {
    await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);
    await interaction.reply({ content: buildPendingStartExpiredMessage() });
    return true;
  }

  if (interaction.user.id !== pending.initiatorId) {
    await interaction.reply({
      content: "Only the person who reacted can pick a mode for this roleplay.",
    });
    return true;
  }

  const guild = await deps.prisma.guild.findUnique({
    where: { id: pending.guildId },
  });
  if (!guild) {
    await interaction.reply({ content: buildNotConfiguredMessage() });
    return true;
  }

  const config = await loadGuildRoleplayConfig(deps.prisma, guild.discordId);
  if (!isRoleplayConfigComplete(config)) {
    await interaction.reply({ content: buildNotConfiguredMessage() });
    return true;
  }

  if (interaction.message.inGuild()) {
    await disableMessageButtons(interaction.message);
  }

  if (buttonData.mode === ROLEPLAY_MODE_SOLO) {
    await deps.prisma.roleplayPendingStart.update({
      where: { id: pending.id },
      data: {
        mode: ROLEPLAY_MODE_SOLO,
        status: PENDING_STATUS_PICK_ROLE,
        expiresAt: new Date(Date.now() + PENDING_START_TTL_MS),
      },
    });

    const sent = await notifyReactorWithComponents(
      interaction.user,
      buildPickRoleMessage(),
      buildRolePickComponents(pending.id, config.roleplayRoles),
    );
    if (!sent) {
      await interaction.update({
        content: "I couldn't DM you. Enable DMs from server members, then react again.",
        components: [],
      });
      return true;
    }

    await interaction.update({
      content: "Check your DMs to pick a role.",
      components: [],
    });
    return true;
  }

  await extendPendingStartExpiry(deps.prisma, pending.id);
  await deps.prisma.roleplayPendingStart.update({
    where: { id: pending.id },
    data: {
      mode: ROLEPLAY_MODE_DUO,
      status: PENDING_STATUS_PICK_PARTNER,
    },
  });

  const sent = await notifyReactorWithComponents(
    interaction.user,
    buildDuoPartnerPromptMessage(),
    [],
  );
  if (!sent) {
    await interaction.update({
      content: "I couldn't DM you. Enable DMs from server members, then react again.",
      components: [],
    });
    return true;
  }

  await interaction.update({
    content: "Check your DMs to @mention your duo partner.",
    components: [],
  });

  return true;
};
