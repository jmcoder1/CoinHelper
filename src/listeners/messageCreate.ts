import { Awaitable, ChannelType, Events, Message, User } from "discord.js";
import { toBalanceUpdate } from "../utils/apiUtils/unbelievaboatUtils/toBalanceUpdate";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { formatImageLimitExceededMessage } from "./utils/discordUtils/formatImageLimitExceededMessage";
import { getMemberImagePostLimit } from "./utils/discordUtils/getMemberImagePostLimit";
import { getImageMultiplier } from "./utils/discordUtils/getImageMultiplier";
import { Listener } from "./utils/types";
import { toUserId } from "./utils/discordUtils/toUserId";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  BOUGHT_COINS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
  INVITES_CHANNEL_NAME,
  LEVELS_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

export interface MessageCreateListener extends Listener {
  event: Events.MessageCreate;
  fn: (message: Message) => Awaitable<void>;
}

export const messageCreate: MessageCreateListener = {
  event: Events.MessageCreate,
  fn: async (message: Message) => {
    if (!message.guildId) return;

    const guild = await prisma.guild.findUnique({
      where: { discordId: message.guildId },
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

    const boughtCoinsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: BOUGHT_COINS_CHANNEL_NAME,
      },
    });
    if (!boughtCoinsGuildChannel) return;

    const invitesGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: INVITES_CHANNEL_NAME,
      },
    });
    if (!invitesGuildChannel) return;

    const levelsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: LEVELS_CHANNEL_NAME,
      },
    });
    if (!levelsGuildChannel) return;

    if (invitesGuildChannel.discordId === message.channelId) {
      const balanceUpdate = toBalanceUpdate(message.client, message.content);
      if (balanceUpdate)
        await updateBalance(message.client, {
          cashAmount: balanceUpdate.cashAmount,
          user: {
            id: balanceUpdate.user.id,
            name: balanceUpdate.user.name,
            iconURL: balanceUpdate.user.iconURL,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          reason: balanceUpdate.reason,
        });
    } else if (levelsGuildChannel.discordId === message.channelId) {
      const recipientMention = message.content.split(" ")[0];
      const recipientUserId = toUserId(recipientMention);

      const user = message.client.users.cache.get(recipientUserId) as User;
      await updateBalance(message.client, {
        user: {
          id: user.id,
          name: user.username,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
          iconURL: user.avatarURL() || undefined,
        },
        cashAmount: 25,
        reason: "New Level",
      });
    } else if (boughtCoinsGuildChannel.discordId === message.channelId) {
      if (message.author.bot && message.author.username === "DISBOARD") {
        const hasSuccessfulBumpMessage =
          message.content.includes("Bump done!") ||
          message.embeds.some((embed) =>
            embed.description?.includes("Bump done!")
          );

        if (hasSuccessfulBumpMessage) {
          const user = message.mentions.users.first(); // Get the user who bumped
          if (user) {
            console.log(`${user.username} used the /bump command.`);

            const BOOST_REWARD_AMOUNT = 100;
            await updateBalance(message.client, {
              user: {
                id: user.id,
                name: user.username,
                iconURL: user.avatarURL() || undefined,
                guild: {
                  id: guild.discordId,
                  currencyPluralName: guildCurrency.namePlural,
                  economyChannelId: economyGuildChannel.discordId,
                  currencyImage: guildCurrency.iconSrc,
                },
              },
              cashAmount: BOOST_REWARD_AMOUNT,
              reason: `You have been rewarded ${BOOST_REWARD_AMOUNT} ${guildCurrency.namePlural} for boosting the server.`,
            });
          }
        }
      }
    } else {
      const num = findNumImages(message.attachments);
      if (!num || num === 0) return;

      const postLimit = await getMemberImagePostLimit(message, guild.id);
      if (
        postLimit &&
        postLimit.maxImages !== null &&
        num > postLimit.maxImages
      ) {
        await message.reply(
          formatImageLimitExceededMessage(
            postLimit.tier,
            postLimit.maxImages,
            num
          )
        );
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
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount,
        reason: `${num} image posts in <#${message.channel.id}>`,
      });
    }

    return;
  },
};
