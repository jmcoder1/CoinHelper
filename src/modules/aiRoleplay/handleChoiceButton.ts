import { ButtonInteraction, Client } from "discord.js";
import { buildRoleplaySystemPrompt } from "./config/buildRoleplaySystemPrompt";
import { generateRoleplayResponse } from "./generateRoleplayResponse";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import {
  ROLEPLAY_MODE_DUO,
  SESSION_STATUS_ACTIVE,
  SESSION_STATUS_ENDED,
} from "./constants";
import { buildGenerationFailedMessage } from "./discord/buildGenerationFailedMessage";
import { buildGeneratingMessage } from "./discord/buildGeneratingMessage";
import { buildGuildEconomyContext } from "./discord/buildGuildEconomyContext";
import { buildInsufficientBalanceMessage } from "./discord/buildInsufficientBalanceMessage";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildNotYourTurnMessage } from "./discord/buildNotYourTurnMessage";
import { buildDuoChoiceUserMessage } from "./discord/buildDuoChoiceUserMessage";
import { buildRoleplayMessageContext } from "./discord/buildRoleplayMessageContext";
import { buildRoleplayStoryPayload } from "./discord/buildRoleplayStoryPayload";
import { buildSessionEndedMessage } from "./discord/buildSessionEndedMessage";
import { buildSourceMessageReply } from "./discord/buildSourceMessageReply";
import { buildSessionExpiredMessage } from "./discord/buildSessionExpiredMessage";
import { disableMessageButtons } from "./discord/disableMessageButtons";
import { fetchRoleplayThread } from "./discord/fetchRoleplayThread";
import { parseChoiceButtonId } from "./discord/parseChoiceButtonId";
import { chargeUser } from "./economy/chargeUser";
import { rewardUser } from "./economy/rewardUser";
import { appendSessionTurn } from "./sessions/appendSessionTurn";
import {
  getPlayerRoleLabelForUser,
  getPlayerRolePromptForUser,
} from "./sessions/getPlayerRoleForUser";
import { getNextTurnUserId } from "./sessions/getNextTurnUserId";
import { getSessionWithTurns } from "./sessions/getSessionWithTurns";
import { isSessionExpired } from "./sessions/isSessionExpired";
import { updateSessionOutput } from "./sessions/updateSessionOutput";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayButtonHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

const getPendingChoices = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

export const tryHandleAiRoleplayButton = async (
  client: Client,
  interaction: ButtonInteraction,
): Promise<boolean> => {
  if (!deps) return false;

  const buttonData = parseChoiceButtonId(interaction.customId);
  if (!buttonData) return false;

  if (!interaction.guild) {
    await interaction.reply({
      content: "This action can only be used in a server.",
      ephemeral: true,
    });
    return true;
  }

  const config = await loadGuildRoleplayConfig(
    deps.prisma,
    interaction.guild.id,
  );
  if (!isRoleplayConfigComplete(config)) {
    await interaction.reply({
      content: buildNotConfiguredMessage(),
      ephemeral: true,
    });
    return true;
  }

  const session = await getSessionWithTurns(deps.prisma, buttonData.sessionId);
  if (!session || session.guildId !== config.guildId) {
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

  if (session.status !== SESSION_STATUS_ACTIVE) {
    await interaction.reply({
      content: "This roleplay session is not active.",
      ephemeral: true,
    });
    return true;
  }

  const activeTurnUserId = session.currentTurnUserId || session.initiatorId;
  if (interaction.user.id !== activeTurnUserId) {
    await interaction.reply({
      content:
        session.mode === ROLEPLAY_MODE_DUO
          ? buildNotYourTurnMessage()
          : "Only the person who started this roleplay can choose.",
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

  const pendingChoices = getPendingChoices(session.pendingChoices);
  const selectedChoice = pendingChoices[buttonData.choiceIndex];
  if (!selectedChoice) {
    await interaction.reply({
      content: "That choice is no longer available.",
      ephemeral: true,
    });
    return true;
  }

  const balance = await deps.getUserCashBalance(
    config.guildDiscordId,
    interaction.user.id,
  );

  if (balance < config.buttonCost) {
    await interaction.reply({
      content: buildInsufficientBalanceMessage(
        config.buttonCost,
        balance,
        config.currencyPluralName,
      ),
      ephemeral: true,
    });
    return true;
  }

  await interaction.reply({
    content: buildGeneratingMessage(),
    ephemeral: true,
  });

  const economyContext = buildGuildEconomyContext(config);
  const isDuo = session.mode === ROLEPLAY_MODE_DUO;

  try {
    const clickerId = interaction.user.id;
    const rolePrompt = getPlayerRolePromptForUser(session, clickerId);
    const userTurnContent = isDuo
      ? buildDuoChoiceUserMessage(
          getPlayerRoleLabelForUser(session, clickerId),
          selectedChoice,
        )
      : selectedChoice;

    const messages = [
      ...session.turns.map((turn) => ({
        role: turn.role as "user" | "assistant",
        content: turn.content,
      })),
      { role: "user" as const, content: userTurnContent },
    ];

    const parsed = await generateRoleplayResponse({
      systemPrompt: buildRoleplaySystemPrompt(config.systemPrompt, rolePrompt, {
        duoTurn: isDuo,
      }),
      thinkingMode: config.thinkingMode,
      messages,
    });
    if (!parsed) {
      await interaction.followUp({
        content: buildGenerationFailedMessage(),
        ephemeral: true,
      });
      return true;
    }

    await chargeUser(
      client,
      deps.updateBalance,
      interaction.user,
      economyContext,
      config.buttonCost,
      `AI roleplay choice in session ${session.id}`,
    );

    const sourceAuthor = await client.users.fetch(session.sourceAuthorId);

    if (config.authorRewardOnChoice > 0) {
      await rewardUser(
        client,
        deps.updateBalance,
        sourceAuthor.id,
        sourceAuthor.username,
        sourceAuthor.avatarURL() ?? undefined,
        economyContext,
        config.authorRewardOnChoice,
        `<@${interaction.user.id}> continued AI roleplay on your message ${session.sourceMessageUrl}`,
      );
    }

    await appendSessionTurn(deps.prisma, session.id, "user", userTurnContent);

    const nextTurnUserId = getNextTurnUserId(session);

    await deps.prisma.roleplaySession.update({
      where: { id: session.id },
      data: { currentTurnUserId: nextTurnUserId },
    });

    const messageContext = buildRoleplayMessageContext({
      session: { ...session, currentTurnUserId: nextTurnUserId },
      actorUserId: interaction.user.id,
      actorAction: "continued",
      selectedChoice,
    });

    const payload = buildRoleplayStoryPayload(
      parsed,
      messageContext,
      session.id,
      config.buttonCost,
      config.currencyImage,
      { showEndButton: isDuo },
    );

    const previousStoryMessage = interaction.message.inGuild()
      ? interaction.message.partial
        ? await interaction.message.fetch()
        : interaction.message
      : null;
    if (interaction.message.inGuild()) {
      await disableMessageButtons(interaction.message);
    }

    const thread = session.threadId
      ? await fetchRoleplayThread(client, session.threadId)
      : null;

    if (thread) {
      const newMessage = await thread.send(
        previousStoryMessage
          ? { ...payload, ...buildSourceMessageReply(previousStoryMessage) }
          : payload,
      );

      await updateSessionOutput(deps.prisma, session.id, {
        outputMessageId: newMessage.id,
        pendingChoices: parsed.choices,
        assistantStory: parsed.story,
      });
    } else {
      const outputChannelId =
        session.outputChannelId ?? config.aiRoleplayChannelId;
      const outputChannel = await client.channels.fetch(outputChannelId);

      if (!outputChannel?.isTextBased()) {
        await interaction.followUp({
          content: buildNotConfiguredMessage(),
          ephemeral: true,
        });
        return true;
      }

      const newMessage = await outputChannel.send(payload);

      await updateSessionOutput(deps.prisma, session.id, {
        outputMessageId: newMessage.id,
        outputChannelId: outputChannel.id,
        pendingChoices: parsed.choices,
        assistantStory: parsed.story,
      });
    }

  } catch (error) {
    console.error("AI roleplay button failed:", error);
    await interaction.followUp({
      content: buildGenerationFailedMessage(),
      ephemeral: true,
    });
  }

  return true;
};
