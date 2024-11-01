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

    return;
  },
};
