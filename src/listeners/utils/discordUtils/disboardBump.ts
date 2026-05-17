import { Message, User } from "discord.js";

/** Official DISBOARD bot application id */
export const DISBOARD_BOT_ID = "302050872383242240";

export const BUMP_REWARD_AMOUNT = 100;

export const isDisboardBot = (message: Message): boolean =>
  message.author.bot && message.author.id === DISBOARD_BOT_ID;

export const hasSuccessfulBumpMessage = (message: Message): boolean =>
  message.content.includes("Bump done!") ||
  message.embeds.some((embed) => embed.description?.includes("Bump done!"));

/** Slash-command invoker first; legacy DISBOARD messages may @mention the bumper. */
export const getDisboardBumpUser = (message: Message): User | null =>
  message.interaction?.user ?? message.mentions.users.first() ?? null;

export const isDisboardBumpRewardMessage = (message: Message): boolean =>
  isDisboardBot(message) &&
  hasSuccessfulBumpMessage(message) &&
  getDisboardBumpUser(message) !== null;
