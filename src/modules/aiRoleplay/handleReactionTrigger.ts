import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { isRoleplayConfigComplete } from "./config/isRoleplayConfigComplete";
import { loadGuildRoleplayConfig } from "./config/loadGuildRoleplayConfig";
import { buildNotAllowedMessage } from "./discord/buildNotAllowedMessage";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildPickRoleMessage } from "./discord/buildPickRoleMessage";
import { buildRolePickComponents } from "./discord/buildRolePickComponents";
import { emojiMatchesTrigger } from "./discord/emojiMatchesTrigger";
import { notifyReactor } from "./discord/notifyReactor";
import { notifyReactorWithComponents } from "./discord/notifyReactorWithComponents";
import { extractRoleplayInput } from "./extraction/extractRoleplayInput";
import { containsBannedWord } from "./parsing/containsBannedWord";
import { createRoleplayPendingStart } from "./sessions/createRoleplayPendingStart";
import { deleteRoleplayPendingStart } from "./sessions/deleteRoleplayPendingStart";
import { AiRoleplayDeps } from "./types";

let deps: AiRoleplayDeps | null = null;

export const initAiRoleplayReactionHandler = (nextDeps: AiRoleplayDeps) => {
  deps = nextDeps;
};

export const tryHandleAiRoleplayReaction = async (
  _client: Client,
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

  try {
    const pending = await createRoleplayPendingStart(deps.prisma, {
      guildId: config.guildId,
      initiatorId: user.id,
      sourceMessageId: message.id,
      sourceChannelId: message.channelId,
      sourceAuthorId: message.author.id,
      sourceMessageUrl: message.url,
      sourceCaption: extracted.caption,
      sourceImageUrl: extracted.imageUrl,
    });

    const sent = await notifyReactorWithComponents(
      user as User,
      buildPickRoleMessage(),
      buildRolePickComponents(pending.id, config.roleplayRoles),
    );

    if (!sent) {
      await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(
        () => undefined,
      );
      await notifyReactor(
        user as User,
        "I couldn't DM you. Enable DMs from server members, then react again.",
      );
    }
  } catch (error) {
    console.error("AI roleplay reaction failed:", error);
    await notifyReactor(
      user as User,
      "Something went wrong starting roleplay. Please try again.",
    );
  }

  return true;
};
