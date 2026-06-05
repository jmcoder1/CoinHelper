import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { callRoleplayModel } from "./api/roleplayClient";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildGenerationFailedMessage } from "./discord/buildGenerationFailedMessage";
import { buildGeneratingMessage } from "./discord/buildGeneratingMessage";
import { buildGuildEconomyContext } from "./discord/buildGuildEconomyContext";
import { buildNotAllowedMessage } from "./discord/buildNotAllowedMessage";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildRoleplayStoryPayload } from "./discord/buildRoleplayStoryPayload";
import { buildRoleplayThreadStarter } from "./discord/buildRoleplayThreadStarter";
import { buildSourceMessageReply } from "./discord/buildSourceMessageReply";
import { createRoleplayThread } from "./discord/createRoleplayThread";
import { emojiMatchesTrigger } from "./discord/emojiMatchesTrigger";
import { notifyReactor } from "./discord/notifyReactor";
import { rewardUser } from "./economy/rewardUser";
import { extractRoleplayInput } from "./extraction/extractRoleplayInput";
import { containsBannedWord } from "./parsing/containsBannedWord";
import { parseModelResponse } from "./parsing/parseModelResponse";
import { createRoleplaySession } from "./sessions/createRoleplaySession";
import { updateSessionOutput } from "./sessions/updateSessionOutput";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayReactionHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayReaction = async (
  client: Client,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
): Promise<boolean> => {
  if (!deps) return false;
  if (!reaction.message.guildId) return false;

  const config = await loadGuildRoleplayConfig(
    deps.prisma,
    reaction.message.guildId,
  );
  if (!config) return false;
  if (!emojiMatchesTrigger(reaction, config.triggerEmoji)) return false;

  if (!isRoleplayConfigComplete(config)) {
    await notifyReactor(user as User, buildNotConfiguredMessage());
    return true;
  }

  const message = reaction.message.partial
    ? await reaction.message.fetch()
    : reaction.message;

  if (!message.author || !message.guild) return true;

  const extracted = extractRoleplayInput(message);
  if (!extracted) {
    await notifyReactor(
      user as User,
      "React on a message that has text (a caption).",
    );
    return true;
  }

  if (containsBannedWord(extracted.caption)) {
    await notifyReactor(user as User, buildNotAllowedMessage());
    return true;
  }

  await notifyReactor(user as User, buildGeneratingMessage());

  const economyContext = buildGuildEconomyContext(config);

  try {
    const session = await createRoleplaySession(deps.prisma, {
      guildId: config.guildId,
      sourceMessageId: message.id,
      sourceChannelId: message.channelId,
      sourceAuthorId: message.author.id,
      initiatorId: user.id,
      sourceMessageUrl: message.url,
      sourceCaption: extracted.caption,
      sourceImageUrl: extracted.imageUrl,
    });

    const raw = await callRoleplayModel({
      systemPrompt: config.systemPrompt,
      thinkingMode: config.thinkingMode,
      messages: [{ role: "user", content: extracted.caption }],
    });

    const parsed = parseModelResponse(raw);
    if (!parsed) {
      await notifyReactor(user as User, buildGenerationFailedMessage());
      return true;
    }

    const outputChannel = await client.channels.fetch(config.aiRoleplayChannelId);
    if (!outputChannel?.isTextBased()) {
      await notifyReactor(user as User, buildNotConfiguredMessage());
      return true;
    }

    const messageContext = {
      sourceAuthorId: message.author.id,
      sourceMessageUrl: message.url,
      sourceCaption: extracted.caption,
      imageUrl: extracted.imageUrl,
      actorUserId: user.id,
      actorAction: "triggered" as const,
    };

    const starterMessage = await outputChannel.send({
      ...buildRoleplayThreadStarter(messageContext),
      ...buildSourceMessageReply(message),
    });
    const thread = await createRoleplayThread(starterMessage);

    const storyMessage = await thread.send(
      buildRoleplayStoryPayload(parsed, messageContext, session.id),
    );

    await updateSessionOutput(deps.prisma, session.id, {
      starterMessageId: starterMessage.id,
      threadId: thread.id,
      outputMessageId: storyMessage.id,
      outputChannelId: outputChannel.id,
      pendingChoices: parsed.choices,
      assistantStory: parsed.story,
    });

    if (config.authorRewardOnTrigger > 0) {
      await rewardUser(
        client,
        deps.updateBalance,
        message.author.id,
        message.author.username,
        message.author.avatarURL() ?? undefined,
        economyContext,
        config.authorRewardOnTrigger,
        `<@${user.id}> triggered AI roleplay on your message ${message.url}`,
      );
    }
  } catch (error) {
    console.error("AI roleplay reaction failed:", error);
    await notifyReactor(user as User, buildGenerationFailedMessage());
  }

  return true;
};
