import { Message } from "discord.js";

export const buildSourceMessageReply = (sourceMessage: Message) => ({
  reply: { messageReference: sourceMessage },
});
