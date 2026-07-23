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
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";

export interface MessageDeleteListener extends Listener {
  event: Events.MessageDelete;
  fn: (message: Message | PartialMessage) => Awaitable<void>;
}

export const messageDelete: MessageDeleteListener = {
  event: Events.MessageDelete,
  fn: async (message: Message | PartialMessage) => {
    if (!message.author) return;

    const numImages = findNumImages(message.attachments);
    if (!numImages || numImages === 0) return;
    if (message.channel.type != ChannelType.GuildText) return;
    const imageMultiplier = getImageMultiplier(message.channel.name);
    if (imageMultiplier === 0) return;

    const cashAmount = -(numImages * imageMultiplier);
    if (cashAmount === 0) return;

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
        cashAmount,
        reason: `${numImages} off topic media`,
      }),
    );
  },
};
