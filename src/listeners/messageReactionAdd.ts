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
import { tryHandleAiRoleplayReaction } from "../modules/aiRoleplay";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { ensureFullMessage } from "./utils/discordUtils/ensureFullMessage";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
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

export interface MessageReactionAddListener extends Listener {
  event: Events.MessageReactionAdd;
  fn: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => Awaitable<void>;
}

export const INCREMENTOR_EMOJI = "🔥";

export const messageReactionAdd: MessageReactionAddListener = {
  event: Events.MessageReactionAdd,
  fn: async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    if (reaction.partial)
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("[economy:reaction-add] Failed to fetch reaction:", error);
        return;
      }

    if (user.partial)
      try {
        await user.fetch();
      } catch (error) {
        console.error("[economy:reaction-add] Failed to fetch user:", error);
        return;
      }

    // Only log the fire-reward path; ignore unrelated reactions.
    if (reaction.emoji.name !== INCREMENTOR_EMOJI) return;

    const guildId = reaction.message.guildId;
    economyLog("reaction-add", "🔥 received", {
      guildId,
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      reactorId: user.id,
      reactorBot: user.bot,
      reactionCount: reaction.count,
      messagePartial: reaction.message.partial,
    });

    if (!guildId) {
      economyLog("reaction-add", "skip: not in a guild");
      return;
    }

    const message = await ensureFullMessage(reaction.message, "reaction-add");
    if (!message) {
      economyLog("reaction-add", "skip: ensureFullMessage returned null", {
        messageId: reaction.message.id,
        guildId,
      });
      return;
    }

    if (!message.author) {
      economyLog("reaction-add", "skip: message has no author", {
        messageId: message.id,
        guildId,
      });
      return;
    }

    if (user.bot) {
      economyLog("reaction-add", "skip: reactor is a bot", {
        reactorId: user.id,
        messageId: message.id,
      });
      return;
    }

    const aiRoleplayHandled = await tryHandleAiRoleplayReaction(
      message.client,
      reaction,
      user,
    );
    if (aiRoleplayHandled) {
      economyLog("reaction-add", "skip: handled by AI roleplay instead", {
        reactorId: user.id,
        messageId: message.id,
      });
      return;
    }

    if (message.author.id === user.id) {
      economyLog("reaction-add", "skip: self-react", {
        userId: user.id,
        messageId: message.id,
      });
      return;
    }

    const guild = await prisma.guild.findUnique({
      where: { discordId: guildId },
    });
    if (!guild) {
      economyLog("reaction-add", "skip: guild not in database", { guildId });
      return;
    }

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) {
      economyLog("reaction-add", "skip: no guild currency configured", {
        guildId,
        guildDbId: guild.id,
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
      economyLog("reaction-add", "skip: no economy channel configured", {
        guildId,
        guildDbId: guild.id,
      });
      return;
    }

    const attachments = summarizeAttachments(message.attachments);
    const numImages = findNumImages(message.attachments) ?? 0;
    economyLog("reaction-add", "attachment scan", {
      messageId: message.id,
      attachmentCount: message.attachments.size,
      numImages,
      attachments,
    });
    if (numImages === 0) {
      economyLog(
        "reaction-add",
        "skip: no countable image/video attachments (check contentType)",
        { messageId: message.id, attachments },
      );
      return;
    }

    const author = message.author;
    economyLog("reaction-add", "paying reaction reward", {
      authorId: author.id,
      reactorId: user.id,
      cashAmount: REACTION_REWARD_AMOUNT,
      economyChannelId: economyGuildChannel.discordId,
      messageUrl: message.url,
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
        cashAmount: REACTION_REWARD_AMOUNT,
        reason: `<@${user.id}> positively reacted to your message ${message.url}`,
      }),
    );
    if (payError) {
      economyLog("reaction-add", "reaction reward failed", {
        authorId: author.id,
        error: payError instanceof Error ? payError.message : String(payError),
      });
    } else {
      economyLog("reaction-add", "reaction reward ok", {
        authorId: author.id,
        cashAmount: REACTION_REWARD_AMOUNT,
      });
    }

    const incrementorReactionCount = reaction.count;

    if (
      incrementorReactionCount ===
      TWENTY_FIVE_PLUS_REACTION_THRESHOLD + 1
    ) {
      economyLog("reaction-add", "paying 25+ bonus", {
        authorId: author.id,
        reactionCount: incrementorReactionCount,
        cashAmount: TWENTY_FIVE_PLUS_REACTION_BONUS,
      });
      const [, bonusError] = await tryAsyncAwait(() =>
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
          cashAmount: TWENTY_FIVE_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} received more than ${TWENTY_FIVE_PLUS_REACTION_THRESHOLD} reactions!`,
        }),
      );
      economyLog(
        "reaction-add",
        bonusError ? "25+ bonus failed" : "25+ bonus ok",
        {
          authorId: author.id,
          error:
            bonusError instanceof Error
              ? bonusError.message
              : bonusError
                ? String(bonusError)
                : undefined,
        },
      );
    } else if (
      incrementorReactionCount ===
      TEN_PLUS_REACTION_THRESHOLD + 1
    ) {
      economyLog("reaction-add", "paying 10+ bonus", {
        authorId: author.id,
        reactionCount: incrementorReactionCount,
        cashAmount: TEN_PLUS_REACTION_BONUS,
      });
      const [, bonusError] = await tryAsyncAwait(() =>
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
          cashAmount: TEN_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} received more than ${TEN_PLUS_REACTION_THRESHOLD} reactions!`,
        }),
      );
      economyLog(
        "reaction-add",
        bonusError ? "10+ bonus failed" : "10+ bonus ok",
        {
          authorId: author.id,
          error:
            bonusError instanceof Error
              ? bonusError.message
              : bonusError
                ? String(bonusError)
                : undefined,
        },
      );
    }
  },
};
