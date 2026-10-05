import { Message, PartialMessage } from "discord.js";

/**
 * Without the Message Content intent, Discord strips content/embeds/attachments
 * from other people's guild messages on both Gateway events and REST Get Message.
 * Do not refetch a non-partial empty body — that floods the REST queue and
 * delays slash-command replies. Partial structures still need a fetch.
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

    return message;
  } catch (error) {
    console.error(
      `${prefix}ensureFullMessage failed for ${message.id}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};
