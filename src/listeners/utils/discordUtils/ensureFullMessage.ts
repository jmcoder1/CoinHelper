import { Message, PartialMessage } from "discord.js";

/**
 * Discord strips content/embeds/attachments from guild MESSAGE_* gateway
 * events without the Message Content privileged intent. REST Get Message
 * still returns the full body — refetch when the gateway payload looks empty.
 */
export const ensureFullMessage = async (
  message: Message | PartialMessage,
): Promise<Message | null> => {
  try {
    if (message.partial) {
      return await message.fetch();
    }

    const bodyMissing =
      message.content === "" &&
      message.attachments.size === 0 &&
      message.embeds.length === 0;

    if (bodyMissing && message.guildId) {
      return await message.fetch();
    }

    return message;
  } catch (error) {
    console.error(
      `ensureFullMessage failed for ${message.id}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};
