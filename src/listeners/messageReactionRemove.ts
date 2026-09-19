import {
  Awaitable,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { Listener } from "./utils/types";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { ensureFullMessage } from "./utils/discordUtils/ensureFullMessage";
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import {
  economyLog,
  summarizeAttachments,
} from "./utils/economyPayoutLog";
import {
  REACTION_REWARD_AMOUNT,
  TEN_PLUS_REACTION_BONUS,
  TEN_PLUS_REACTION_THRESHOLD,
  TWENTY_FIVE_PLUS_REACTION_BONUS,
  TWENTY_FIVE_PLUS_REACTION_THRESHOLD,
} from "./utils/reactionThresholds";

export interface MessageReactionRemoveListener extends Listener {
  event: Events.MessageReactionRemove;
  fn: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => Awaitable<void>;
}

export const INCREMENTOR_EMOJI = "🔥";

export const messageReactionRemove: MessageReactionRemoveListener = {
  event: Events.MessageReactionRemove,
  fn: async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    if (reaction.emoji.name !== INCREMENTOR_EMOJI) return;

    if (reaction.partial)
      try {
        await reaction.fetch();
      } catch (error) {
        console.error(
          "[economy:reaction-remove] Failed to fetch reaction:",
          error,
        );
        return;
      }

    if (user.partial)
      try {
        await user.fetch();
      } catch (error) {
        console.error(
          "[economy:reaction-remove] Failed to fetch user:",
          error,
        );
        return;
      }

    const guildId = reaction.message.guildId;
    economyLog("reaction-remove", "🔥 removed", {
      guildId,
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      reactorId: user.id,
      reactorBot: user.bot,
      reactionCount: reaction.count,
    });

    if (!guildId) {
      economyLog("reaction-remove", "skip: not in a guild");
      return;
    }

    const message = await ensureFullMessage(
      reaction.message,
      "reaction-remove",
    );
    if (!message) {
      economyLog("reaction-remove", "skip: ensureFullMessage returned null", {
        messageId: reaction.message.id,
        guildId,
      });
      return;
    }

    if (!message.author) {
      economyLog("reaction-remove", "skip: message has no author", {
        messageId: message.id,
      });
      return;
    }

    if (user.bot) {
      economyLog("reaction-remove", "skip: reactor is a bot", {
        reactorId: user.id,
      });
      return;
    }

    if (message.author.id === user.id) {
      economyLog("reaction-remove", "skip: self-react", {
        userId: user.id,
        messageId: message.id,
      });
      return;
    }

    const guild = await prisma.guild.findUnique({
      where: { discordId: guildId },
    });
    if (!guild) {
      economyLog("reaction-remove", "skip: guild not in database", { guildId });
      return;
    }

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) {
      economyLog("reaction-remove", "skip: no guild currency configured", {
        guildId,
      });
      return;
    }

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) {
      economyLog("reaction-remove", "skip: no economy channel configured", {
        guildId,
      });
      return;
    }

    const attachments = summarizeAttachments(message.attachments);
    const numImages = findNumImages(message.attachments) ?? 0;
    economyLog("reaction-remove", "attachment scan", {
      messageId: message.id,
      attachmentCount: message.attachments.size,
      numImages,
      attachments,
    });
    if (numImages === 0) {
      economyLog(
        "reaction-remove",
        "skip: no countable image/video attachments",
        { messageId: message.id, attachments },
      );
      return;
    }

    const author = message.author;
    economyLog("reaction-remove", "clawing back reaction reward", {
      authorId: author.id,
      reactorId: user.id,
      cashAmount: -REACTION_REWARD_AMOUNT,
    });

    const [, payError] = await tryAsyncAwait(() =>
      updateBalance(message.client, {
        user: {
          id: author.id,
          name: author.username,
          iconURL: author.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: -REACTION_REWARD_AMOUNT,
        reason: `<@${user.id}> negatively reacted to your message ${message.url}`,
      }),
    );
    economyLog(
      "reaction-remove",
      payError ? "reaction clawback failed" : "reaction clawback ok",
      {
        authorId: author.id,
        error:
          payError instanceof Error
            ? payError.message
            : payError
              ? String(payError)
              : undefined,
      },
    );

    const incrementorReactionCount = reaction.count;

    if (incrementorReactionCount === TWENTY_FIVE_PLUS_REACTION_THRESHOLD) {
      economyLog("reaction-remove", "clawing back 25+ bonus", {
        authorId: author.id,
        reactionCount: incrementorReactionCount,
      });
      await tryAsyncAwait(() =>
        updateBalance(message.client, {
          user: {
            id: author.id,
            name: author.username,
            iconURL: author.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: -TWENTY_FIVE_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} dropped below the ${TWENTY_FIVE_PLUS_REACTION_THRESHOLD}+ reactions threshold.`,
        }),
      );
    } else if (incrementorReactionCount === TEN_PLUS_REACTION_THRESHOLD) {
      economyLog("reaction-remove", "clawing back 10+ bonus", {
        authorId: author.id,
        reactionCount: incrementorReactionCount,
      });
      await tryAsyncAwait(() =>
        updateBalance(message.client, {
          user: {
            id: author.id,
            name: author.username,
            iconURL: author.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: -TEN_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} dropped below the ${TEN_PLUS_REACTION_THRESHOLD}+ reactions threshold.`,
        }),
      );
    }
  },
};
