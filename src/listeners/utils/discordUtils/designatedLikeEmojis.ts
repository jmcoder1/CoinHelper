import { Emoji, Message, MessageReaction, PartialMessageReaction } from "discord.js";
import { AUTO_REACT_EMOJIS } from "./autoReactTierMedia";

/** Same set used for auto-react and for 10+ like / feature counting. */
export const DESIGNATED_LIKE_EMOJIS = AUTO_REACT_EMOJIS;

export const isDesignatedLikeEmoji = (
  emoji: Pick<Emoji, "name"> | { name: string | null }
): boolean => {
  const name = emoji.name;
  if (!name) return false;
  return (DESIGNATED_LIKE_EMOJIS as readonly string[]).includes(name);
};

/**
 * Total reaction count across designated like emojis.
 * Prefers the triggering reaction's count when it matches a designated emoji.
 */
export const countDesignatedLikes = (
  message: Message,
  triggeringReaction?: MessageReaction | PartialMessageReaction
): number => {
  let total = 0;

  for (const emoji of DESIGNATED_LIKE_EMOJIS) {
    if (triggeringReaction?.emoji.name === emoji) {
      total += triggeringReaction.count ?? 0;
      continue;
    }

    const cached = message.reactions.cache.find(
      (reaction) => reaction.emoji.name === emoji
    );
    total += cached?.count ?? 0;
  }

  return total;
};
