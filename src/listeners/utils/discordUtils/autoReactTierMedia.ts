import { ChannelType, Message } from "discord.js";
import { tryAsyncAwait } from "../../../utils/tryAsyncAwait";
import { findNumImages } from "./findNumImages";
import { isRockDiamondChannel } from "./tierChannel";
import { economyLog } from "../economyPayoutLog";

/** Emojis the bot adds to image/gif/video posts in rock→diamond channels. */
export const AUTO_REACT_EMOJIS = ["🔥"] as const;

/**
 * React with {@link AUTO_REACT_EMOJIS} on media posts in rock→diamond channels.
 * Skips bots and non-media messages. Failures are logged and do not throw.
 */
export const maybeAutoReactTierMedia = async (
  message: Message
): Promise<void> => {
  if (message.author?.bot) return;
  if (message.channel.type !== ChannelType.GuildText) return;
  if (message.attachments.size === 0) return;
  if (!isRockDiamondChannel(message.channel.name)) return;

  const numMedia = findNumImages(message.attachments) ?? 0;
  if (numMedia === 0) return;

  economyLog("auto-react", "reacting to tier media post", {
    messageId: message.id,
    channelId: message.channelId,
    channelName: message.channel.name,
    emojis: [...AUTO_REACT_EMOJIS],
    numMedia,
  });

  for (const emoji of AUTO_REACT_EMOJIS) {
    const [, error] = await tryAsyncAwait(() => message.react(emoji));
    if (error) {
      economyLog("auto-react", "react failed", {
        messageId: message.id,
        emoji,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
