import { ButtonInteraction, Client } from "discord.js";
import { ROLEPLAY_MODE_DUO, SESSION_STATUS_ENDED } from "./constants";
import { disableMessageButtons } from "./discord/disableMessageButtons";
import { parseEndSessionButtonId } from "./discord/parseEndSessionButtonId";
import { buildSessionEndedMessage } from "./discord/buildSessionEndedMessage";
import { endRoleplaySession } from "./sessions/endRoleplaySession";
import { getSessionWithTurns } from "./sessions/getSessionWithTurns";
import { isSessionExpired } from "./sessions/isSessionExpired";
import { buildSessionExpiredMessage } from "./discord/buildSessionExpiredMessage";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayEndHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

const canEndSession = (
  session: { initiatorId: string; partnerId: string | null; mode: string },
  userId: string,
): boolean => {
  if (userId === session.initiatorId) return true;
  if (session.mode === ROLEPLAY_MODE_DUO && session.partnerId === userId) {
    return true;
  }
  return false;
};

export const tryHandleAiRoleplayEnd = async (
  _client: Client,
  interaction: ButtonInteraction,
): Promise<boolean> => {
  if (!deps) return false;

  const buttonData = parseEndSessionButtonId(interaction.customId);
  if (!buttonData) return false;

  const session = await getSessionWithTurns(deps.prisma, buttonData.sessionId);
  if (!session) {
    await interaction.reply({
      content: "This roleplay session could not be found.",
      ephemeral: true,
    });
    return true;
  }

  if (session.status === SESSION_STATUS_ENDED) {
    await interaction.reply({
      content: buildSessionEndedMessage(),
      ephemeral: true,
    });
    return true;
  }

  if (isSessionExpired(session.expiresAt)) {
    await interaction.reply({
      content: buildSessionExpiredMessage(),
      ephemeral: true,
    });
    return true;
  }

  if (!canEndSession(session, interaction.user.id)) {
    await interaction.reply({
      content: "Only the players in this session can end it.",
      ephemeral: true,
    });
    return true;
  }

  await endRoleplaySession(deps.prisma, session.id);

  if (interaction.message.inGuild()) {
    await disableMessageButtons(interaction.message);
  }

  await interaction.reply({
    content: "Roleplay session ended.",
    ephemeral: true,
  });

  return true;
};
