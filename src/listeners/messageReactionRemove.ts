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
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
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
        console.error("Failed to fetch reaction:", error);
        return;
      }

    if (user.partial)
      try {
        await user.fetch();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return;
      }

    if (!reaction.message.guildId) return;

    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // has no author
    if (!message.author) return;

    // is bot
    if (user.bot) return;

    // is self reacting
    if (message.author.id === user.id) return;

    // Fetch the guild
    const guild = await prisma.guild.findUnique({
      where: { discordId: reaction.message.guildId },
    });
    if (!guild) return;

    // Fetch the guild currency
    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) return;

    // Fetch the economy guild channel
    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) return;

    // has no images
    const numImages = findNumImages(message.attachments);
    if (numImages === 0) return;

    const author = message.author;
    if (!author) return;

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
        cashAmount: -REACTION_REWARD_AMOUNT,
        reason: `<@${user.id}> negatively reacted to your message ${message.url}`,
      }),
    );

    const incrementorReactionCount = reaction.count;

    // Only remove the threshold bonus when the 🔥 reaction count crosses down.
    if (incrementorReactionCount === TWENTY_FIVE_PLUS_REACTION_THRESHOLD) {
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

    return;
  },
};
