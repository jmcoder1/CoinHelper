import {
  Awaitable,
  ChannelType,
  Events,
  Message,
  PartialMessage,
} from "discord.js";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { getImageMultiplier } from "./utils/discordUtils/getImageMultiplier";
import { Listener } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";

export interface MessageDeleteListener extends Listener {
  event: Events.MessageDelete;
  fn: (message: Message | PartialMessage) => Awaitable<void>;
}

export const messageDelete: MessageDeleteListener = {
  event: Events.MessageDelete,
  fn: async (message: Message | PartialMessage) => {
    if (!message.guildId || !message.author) return;
    const guildInfo = getGuildInfoById(message.guildId);
    if (!guildInfo) return;

    const numImages = findNumImages(message.attachments);
    if (!numImages || numImages === 0) return;
    if (message.channel.type != ChannelType.GuildText) return;
    const imageMultiplier = getImageMultiplier(message.channel.name);
    if (imageMultiplier === 0) return;

    const cashAmount = -(numImages * imageMultiplier);
    if (cashAmount === 0) return;

    await updateBalance(message.client, {
      user: {
        id: message.author.id,
        name: message.author.username,
        iconURL: message.author.avatarURL() || undefined,
        guild: {
          id: guildInfo.id,
          currencyPluralName: guildInfo.currencyPluralName,
          economyChannelId: guildInfo.channels.economyChannelId,
          currencyImage: guildInfo.images.currency[0],
        },
      },
      cashAmount,
      reason: `${numImages} off topic media removed from <#${message.channel.id}>`,
    });
  },
};
