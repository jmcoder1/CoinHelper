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
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
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
    // Fetch partial reaction if necessary
    if (reaction.partial)
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Failed to fetch reaction:", error);
        return;
      }

    // Fetch partial user if necessary
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

    const aiRoleplayHandled = await tryHandleAiRoleplayReaction(
      message.client,
      reaction,
      user,
    );
    if (aiRoleplayHandled) return;

    // is self reacting
    if (message.author.id === user.id) return;

    if (reaction.emoji.name !== INCREMENTOR_EMOJI) return;

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

    const numImages = findNumImages(message.attachments);
    if (numImages === 0) return;

    await updateBalance(message.client, {
      user: {
        id: message.author.id,
        name: message.author.username,
        iconURL: message.author.avatarURL() || undefined,
        guild: {
          id: guild.discordId,
          currencyPluralName: guildCurrency.namePlural,
          economyChannelId: economyGuildChannel.discordId,
          currencyImage: guildCurrency.iconSrc,
        },
      },
      cashAmount: REACTION_REWARD_AMOUNT,
      reason: `<@${user.id}> positively reacted to your message ${message.url}`,
    });

    const incrementorReactionCount = reaction.count;

    // Only award the threshold bonus when the 🔥 reaction count crosses up.
    if (
      incrementorReactionCount ===
      TWENTY_FIVE_PLUS_REACTION_THRESHOLD + 1
    ) {
      await updateBalance(message.client, {
        user: {
          id: message.author.id,
          name: message.author.username,
          iconURL: message.author.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: TWENTY_FIVE_PLUS_REACTION_BONUS,
        reason: `Your message ${message.url} received more than ${TWENTY_FIVE_PLUS_REACTION_THRESHOLD} reactions!`,
      });
    } else if (
      incrementorReactionCount ===
      TEN_PLUS_REACTION_THRESHOLD + 1
    ) {
      await updateBalance(message.client, {
        user: {
          id: message.author.id,
          name: message.author.username,
          iconURL: message.author.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: TEN_PLUS_REACTION_BONUS,
        reason: `Your message ${message.url} received more than ${TEN_PLUS_REACTION_THRESHOLD} reactions!`,
      });
    }
  },
};
