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
      const balanceUpdate = toBalanceUpdate(message.client, message.content);
      if (balanceUpdate)
        await updateBalance(message.client, {
          cashAmount: balanceUpdate.cashAmount,
          user: {
            id: balanceUpdate.user.id,
            name: balanceUpdate.user.name,
            iconURL: balanceUpdate.user.iconURL,
            guild: {
              id: guildInfo.id,
              currencyPluralName: guildInfo.currencyPluralName,
              currencyImage: guildInfo.images.currency[0],
              economyChannelId: guildInfo.channels.economyChannelId,
            },
          },
          reason: balanceUpdate.reason,
        });
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
            currencyImage: guildInfo.images.currency[0],
            economyChannelId: guildInfo.channels.economyChannelId,
          },
          iconURL: user.avatarURL() || undefined,
        },
        cashAmount: 25,
        reason: "New Level",
      });
    } else if (guildInfo.channels.boughtCoinsChannelId === message.channelId) {
      if (message.author.bot && message.author.username === "DISBOARD") {
        // Check if the message contains the "Bump done!" text
        if (!message.content.includes("Bump done!")) {
          const user = message.mentions.users.first(); // Get the user who bumped
          if (user) {
            console.log(`${user.username} used the /bump command.`);
            // Perform any additional actions, such as logging or rewarding the user

            const BOOST_REWARD_AMOUNT = 100;
            await updateBalance(message.client, {
              user: {
                id: message.author.id,
                name: message.author.username,
                iconURL: message.author.avatarURL() || undefined,
                guild: {
                  id: guildInfo.id,
                  currencyPluralName: guildInfo.currencyPluralName,
                  currencyImage: guildInfo.images.currency[0],
                  economyChannelId: guildInfo.channels.economyChannelId,
                },
              },
              cashAmount: BOOST_REWARD_AMOUNT,
              reason: `You have been rewarded ${BOOST_REWARD_AMOUNT} ${guildInfo.currencyPluralName} for boosting the server.`,
            });
          }
        }
      }
    } else {
      const num = findNumImages(message.attachments);
      if (!num || num === 0) return;

      if (num > 5) {
        await message.reply("You can only post 5 images at a time!");
        await message.delete();
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
            currencyImage: guildInfo.images.currency[0],
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
