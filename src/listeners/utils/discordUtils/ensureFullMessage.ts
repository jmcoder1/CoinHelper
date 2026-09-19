import { Message, PartialMessage } from "discord.js";

/**
 * Discord strips content/embeds/attachments from guild MESSAGE_* gateway
 * events without the Message Content privileged intent. REST Get Message
 * still returns the full body — refetch when the gateway payload looks empty.
 */
export const ensureFullMessage = async (
  message: Message | PartialMessage,
  logLabel?: string,
): Promise<Message | null> => {
  const prefix = logLabel ? `[economy:${logLabel}] ` : "";

  try {
    if (message.partial) {
      console.log(
        `${prefix}ensureFullMessage: fetching partial message ${message.id}`,
      );
      const fetched = await message.fetch();
      console.log(`${prefix}ensureFullMessage: partial fetch ok`, {
        messageId: fetched.id,
        attachments: fetched.attachments?.size ?? 0,
        embeds: fetched.embeds?.length ?? 0,
        contentLength: fetched.content?.length ?? 0,
        authorId: fetched.author?.id ?? null,
      });
      return fetched;
    }

    const bodyMissing =
      message.content === "" &&
      message.attachments.size === 0 &&
      message.embeds.length === 0;

    if (bodyMissing && message.guildId) {
      console.log(
        `${prefix}ensureFullMessage: gateway body empty, REST refetch ${message.id}`,
        {
          guildId: message.guildId,
          channelId: message.channelId,
        },
      );
      const fetched = await message.fetch();
      console.log(`${prefix}ensureFullMessage: REST refetch ok`, {
        messageId: fetched.id,
        attachments: fetched.attachments?.size ?? 0,
        embeds: fetched.embeds?.length ?? 0,
        contentLength: fetched.content?.length ?? 0,
        authorId: fetched.author?.id ?? null,
      });
      return fetched;
    }

    return message;
  } catch (error) {
    console.error(
      `${prefix}ensureFullMessage failed for ${message.id}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};
