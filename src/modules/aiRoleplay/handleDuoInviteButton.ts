import { ButtonInteraction, Client } from "discord.js";
import {
  PENDING_STATUS_PICK_ROLE,
  PENDING_STATUS_AWAIT_PARTNER,
  ROLEPLAY_PLAYER_INITIATOR,
  ROLEPLAY_PLAYER_PARTNER,
} from "./constants";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildPendingStartExpiredMessage } from "./discord/buildPendingStartExpiredMessage";
import { buildPickRoleMessage } from "./discord/buildPickRoleMessage";
import { buildRolePickComponents } from "./discord/buildRolePickComponents";
import { disableMessageButtons } from "./discord/disableMessageButtons";
import { notifyReactor } from "./discord/notifyReactor";
import { notifyReactorWithComponents } from "./discord/notifyReactorWithComponents";
import { parseDuoInviteButtonId } from "./discord/parseDuoInviteButtonId";
import { deleteRoleplayPendingStart } from "./sessions/deleteRoleplayPendingStart";
import { extendPendingStartExpiry } from "./sessions/extendPendingStartExpiry";
import { getRoleplayPendingStart } from "./sessions/getRoleplayPendingStart";
import { isSessionExpired } from "./sessions/isSessionExpired";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayDuoInviteHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayDuoInvite = async (
  client: Client,
  interaction: ButtonInteraction,
): Promise<boolean> => {
  if (!deps) return false;

  const buttonData = parseDuoInviteButtonId(interaction.customId);
  if (!buttonData) return false;

  const pending = await getRoleplayPendingStart(deps.prisma, buttonData.pendingId);
  if (!pending || !pending.partnerId) {
    await interaction.reply({ content: buildPendingStartExpiredMessage() });
    return true;
  }

  if (isSessionExpired(pending.expiresAt)) {
    await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);
    await interaction.reply({ content: buildPendingStartExpiredMessage() });
    return true;
  }

  if (interaction.user.id !== pending.partnerId) {
    await interaction.reply({
      content: "This duo invite is not for you.",
    });
    return true;
  }

  if (pending.status !== PENDING_STATUS_AWAIT_PARTNER) {
    await interaction.reply({
      content: "This invite is no longer active.",
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

  if (buttonData.action === "decline") {
    await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);

    const initiator = await client.users.fetch(pending.initiatorId);
    await notifyReactor(
      initiator,
      `<@${interaction.user.id}> declined your duo roleplay invite. React again to start over.`,
    );

    await interaction.update({
      content: "You declined the duo roleplay invite.",
      components: [],
    });
    return true;
  }

  await extendPendingStartExpiry(deps.prisma, pending.id);
  await deps.prisma.roleplayPendingStart.update({
    where: { id: pending.id },
    data: { status: PENDING_STATUS_PICK_ROLE },
  });

  const initiator = await client.users.fetch(pending.initiatorId);

  const initiatorSent = await notifyReactorWithComponents(
    initiator,
    buildPickRoleMessage(),
    buildRolePickComponents(
      pending.id,
      config.roleplayRoles,
      ROLEPLAY_PLAYER_INITIATOR,
    ),
  );

  const partnerSent = await notifyReactorWithComponents(
    interaction.user,
    buildPickRoleMessage(),
    buildRolePickComponents(
      pending.id,
      config.roleplayRoles,
      ROLEPLAY_PLAYER_PARTNER,
    ),
  );

  if (!initiatorSent || !partnerSent) {
    await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);
    await interaction.update({
      content:
        "Couldn't DM both players. Enable DMs from server members and react again.",
      components: [],
    });
    return true;
  }

  await interaction.update({
    content: "Invite accepted. Pick your role below.",
    components: [],
  });

  return true;
};
