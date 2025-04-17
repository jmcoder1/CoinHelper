import { Awaitable, ChannelType, Events, Message, User } from "discord.js";
import { toBalanceUpdate } from "../utils/apiUtils/unbelievaboatUtils/toBalanceUpdate";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { getImageMultiplier } from "./utils/discordUtils/getImageMultiplier";
import { Listener } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { toUserId } from "./utils/discordUtils/toUserId";

export interface MessageCreateListener extends Listener {
  event: Events.MessageCreate;
  fn: (message: Message) => Awaitable<void>;
}

export const messageCreate: MessageCreateListener = {
  event: Events.MessageCreate,
  fn: async (message: Message) => {
    if (!message.guildId) return;
    const guildInfo = getGuildInfoById(message.guildId);
    if (!guildInfo) return;

    if (guildInfo.channels.invitesChannelId === message.channelId) {
      const balanceUpdate = toBalanceUpdate(message.client, message.content, {
        guildId: guildInfo.id,
        currencyPluralName: guildInfo.currencyPluralName,
        economyChannelId: guildInfo.channels.economyChannelId,
      });
      if (balanceUpdate)
        await updateBalance(message.client, { ...balanceUpdate });
    } else if (guildInfo.channels.levelsChannelId === message.channelId) {
      const recipientMention = message.content.split(" ")[0];
      const recipientUserId = toUserId(recipientMention);

      const user = message.client.users.cache.get(recipientUserId) as User;
      await updateBalance(message.client, {
        user: {
          id: user.id,
          name: user.username,
          guild: {
            id: guildInfo.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
          },
          iconURL: user.avatarURL() || undefined,
        },
        cashAmount: 25,
        reason: "New Level",
      });
    } else {
      const num = findNumImages(message.attachments);
      if (!num || num === 0) return;

      if (num > 5) {
        message.reply("You can only post 5 images at a time!");
        return;
      }

      if (message.channel.type != ChannelType.GuildText) return;
      const imageMultiplier = getImageMultiplier(message.channel.name);
      if (imageMultiplier === 0) return;
      const cashAmount = num * imageMultiplier;
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
          },
        },
        cashAmount,
        reason: `${num} image posts in <#${message.channel.id}>`,
      });
    }

    return;
  },
};
