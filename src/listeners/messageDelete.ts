import { Awaitable, Events, Message, PartialMessage } from "discord.js";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
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
    if (!message.id || !message.guildId) return;

    const payout = await prisma.imageCoinPayout.findUnique({
      where: { messageId: message.id },
    });
    if (!payout || payout.clawedBackAt) return;

    const guild = await prisma.guild.findUnique({
      where: { id: payout.guildId },
    });
    if (!guild) return;

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) return;

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) return;

    const [user, userError] = await tryAsyncAwait(() =>
      message.client.users.fetch(payout.userId),
    );
    if (!user || userError) return;

    const [, payError] = await tryAsyncAwait(() =>
      updateBalance(message.client, {
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
        cashAmount: -payout.cashAmount,
        reason: "off topic media",
      }),
    );
    if (payError) return;

    await tryAsyncAwait(() =>
      prisma.imageCoinPayout.update({
        where: { id: payout.id },
        data: { clawedBackAt: new Date() },
      }),
    );
  },
};
