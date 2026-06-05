import { ButtonInteraction, Client } from "discord.js";
import {
  PENDING_STATUS_PICK_ROLE,
  ROLEPLAY_MODE_DUO,
  ROLEPLAY_MODE_SOLO,
  ROLEPLAY_PLAYER_INITIATOR,
  ROLEPLAY_PLAYER_PARTNER,
} from "./constants";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { tryStartDuoRoleplayFromPending } from "./duo/tryStartDuoRoleplayFromPending";
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

  if (pending.status !== PENDING_STATUS_PICK_ROLE) {
    await interaction.reply({
      content: "This roleplay setup is not waiting for a role pick.",
    });
    return true;
  }

  const isDuo = pending.mode === ROLEPLAY_MODE_DUO;

  if (isDuo) {
    if (buttonData.playerSlot === ROLEPLAY_PLAYER_INITIATOR) {
      if (interaction.user.id !== pending.initiatorId) {
        await interaction.reply({
          content: "Only the person who reacted can pick the initiator role.",
        });
        return true;
      }
    } else if (buttonData.playerSlot === ROLEPLAY_PLAYER_PARTNER) {
      if (interaction.user.id !== pending.partnerId) {
        await interaction.reply({
          content: "Only the invited partner can pick their role.",
        });
        return true;
      }
    } else {
      await interaction.reply({
        content: "Invalid role pick for this duo session.",
      });
      return true;
    }
  } else if (interaction.user.id !== pending.initiatorId) {
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

  const roleUpdate =
    isDuo && buttonData.playerSlot === ROLEPLAY_PLAYER_PARTNER
      ? {
          partnerRoleId: selectedRole.id,
          partnerRoleLabel: selectedRole.label,
          partnerRolePrompt: selectedRole.prompt,
        }
      : {
          initiatorRoleId: selectedRole.id,
          initiatorRoleLabel: selectedRole.label,
          initiatorRolePrompt: selectedRole.prompt,
        };

  const updatedPending = await deps.prisma.roleplayPendingStart.update({
    where: { id: pending.id },
    data: roleUpdate,
  });

  if (interaction.message.inGuild()) {
    await disableMessageButtons(interaction.message);
  }

  if (isDuo) {
    const waitingForPartner =
      buttonData.playerSlot === ROLEPLAY_PLAYER_INITIATOR &&
      !updatedPending.partnerRoleId;
    const waitingForInitiator =
      buttonData.playerSlot === ROLEPLAY_PLAYER_PARTNER &&
      !updatedPending.initiatorRoleId;

    if (waitingForPartner || waitingForInitiator) {
      await interaction.update({
        content: `You chose **${selectedRole.label}**. Waiting for your partner to pick a role...`,
        components: [],
      });
      return true;
    }

    await interaction.update({
      content: buildGeneratingMessage(),
      components: [],
    });

    const initiator = await client.users.fetch(updatedPending.initiatorId);
    await tryStartDuoRoleplayFromPending(
      client,
      deps,
      config,
      updatedPending,
      initiator,
    );
    return true;
  }

  await interaction.update({
    content: buildGeneratingMessage(),
    components: [],
  });

  const sourceAuthor = await client.users.fetch(pending.sourceAuthorId);

  await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);

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
    mode: ROLEPLAY_MODE_SOLO,
    selectedRoleId: selectedRole.id,
    selectedRoleLabel: selectedRole.label,
    selectedRolePrompt: selectedRole.prompt,
  });

  return true;
};
