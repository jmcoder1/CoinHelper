import { Message } from "discord.js";

export const extractFirstMentionedUserId = (
  message: Message,
  excludeUserId: string,
): string | null => {
  const mention = message.mentions.users.first();
  if (!mention) return null;
  if (mention.bot) return null;
  if (mention.id === excludeUserId) return null;

  return mention.id;
};
