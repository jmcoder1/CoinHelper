import { MessageReaction, PartialMessageReaction } from "discord.js";

export const emojiMatchesTrigger = (
  reaction: MessageReaction | PartialMessageReaction,
  triggerEmoji: string,
): boolean => {
  const trimmedTrigger = triggerEmoji.trim();
  if (!trimmedTrigger) return false;

  const emoji = reaction.emoji;
  if (!emoji) return false;

  if (emoji.id) {
    return (
      trimmedTrigger === emoji.id ||
      trimmedTrigger === `${emoji.name}:${emoji.id}` ||
      trimmedTrigger === `<:${emoji.name}:${emoji.id}>` ||
      trimmedTrigger === `<a:${emoji.name}:${emoji.id}>`
    );
  }

  return emoji.name === trimmedTrigger;
};
