import {
  Awaitable,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { Listener } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";

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
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Failed to fetch reaction:", error);
        return;
      }
    }

    // Fetch partial user if necessary
    if (user.partial) {
      try {
        await user.fetch();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return;
      }
    }

    if (reaction.emoji.name != INCREMENTOR_EMOJI) return;
    if (!reaction.message.guildId) return;
    const guildInfo = getGuildInfoById(reaction.message.guildId);
    if (!guildInfo) return;

    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // has no author
    if (!message.author) return;

    // is bot
    if (user.bot) return;

    // is self reacting
    if (message.author.id === user.id) return;

    // has no images
    const numImages = findNumImages(message.attachments);
    if (numImages === 0) return;

    await updateBalance(message.client, {
      user: {
        id: message.author.id,
        name: message.author.username,
        iconURL: message.author.avatarURL() || undefined,
        guild: {
          id: guildInfo.id,
          currencyPluralName: guildInfo.currencyPluralName,
          economyChannelId: guildInfo.channels.economyChannelId,
        },
      },
      cashAmount: 5,
      reason: `<@${user.id}> positively reacted to your message ${message.url}`,
    });

    // Check the total number of reactions on the message
    const totalReactions = reaction.message.reactions.cache.reduce(
      (count, reaction) => count + reaction.count,
      0
    );

    // Award additional coins based on reaction thresholds
    if (totalReactions > 25) {
      await updateBalance(message.client, {
        user: {
          id: message.author.id,
          name: message.author.username,
          iconURL: message.author.avatarURL() || undefined,
          guild: {
            id: guildInfo.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
          },
        },
        cashAmount: 100,
        reason: `Your message ${message.url} received more than 25 reactions!`,
      });
    } else if (totalReactions > 10) {
      await updateBalance(message.client, {
        user: {
          id: message.author.id,
          name: message.author.username,
          iconURL: message.author.avatarURL() || undefined,
          guild: {
            id: guildInfo.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
          },
        },
        cashAmount: 50,
        reason: `Your message ${message.url} received more than 10 reactions!`,
      });
    }

    return;
  },
};
