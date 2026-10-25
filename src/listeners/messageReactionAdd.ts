import {
  Awaitable,
  ChannelType,
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
  TWENTY_FIVE_PLUS_REACTION_BONUS,
  TWENTY_FIVE_PLUS_REACTION_THRESHOLD,
} from "./utils/reactionThresholds";
import {
  countDesignatedLikes,
  isDesignatedLikeEmoji,
} from "./utils/discordUtils/designatedLikeEmojis";
import { tryFeatureMediaAtTenLikes } from "./utils/discordUtils/tryFeatureMediaAtTenLikes";
import {
  isRockDiamondChannel,
  TIER_CHANNEL_EMOJIS,
} from "./utils/discordUtils/tierChannel";

export interface MessageReactionAddListener extends Listener {
  event: Events.MessageReactionAdd;
  fn: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => Awaitable<void>;
}

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

    if (!isDesignatedLikeEmoji(reaction.emoji)) return;

    const guildId = reaction.message.guildId;
    economyLog("reaction-add", "designated like received", {
      guildId,
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      reactorId: user.id,
      reactorBot: user.bot,
      emoji: reaction.emoji.name,
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

    if (message.channel.type !== ChannelType.GuildText) {
      economyLog("reaction-add", "skip: channel is not GuildText", {
        messageId: message.id,
        channelType: message.channel.type,
      });
      return;
    }

    if (!isRockDiamondChannel(message.channel.name)) {
      economyLog(
        "reaction-add",
        `skip: channel name has no tier emoji (${TIER_CHANNEL_EMOJIS.join("")})`,
        {
          messageId: message.id,
          channelName: message.channel.name,
        },
      );
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
    const isBotReactor = Boolean(user.bot);
    const isSelfReact = author.id === user.id;

    // Per-react coins: humans only, no self-reacts. Bot auto-reacts still
    // count toward thresholds below.
    if (!isBotReactor && !isSelfReact) {
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
    } else {
      economyLog("reaction-add", "skip per-react reward", {
        reactorId: user.id,
        isBotReactor,
        isSelfReact,
        messageId: message.id,
      });
    }

    await tryFeatureMediaAtTenLikes({
      message,
      triggeringReaction: reaction,
      guild,
      guildCurrency,
      economyChannelId: economyGuildChannel.discordId,
    });

    const likeCount = countDesignatedLikes(message, reaction);
    if (likeCount === TWENTY_FIVE_PLUS_REACTION_THRESHOLD + 1) {
      economyLog("reaction-add", "paying 25+ bonus", {
        authorId: author.id,
        reactionCount: likeCount,
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
    }
  },
};
