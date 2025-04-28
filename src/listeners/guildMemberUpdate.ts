import {
  Awaitable,
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import { Listener } from "./utils/types";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import {
  BOUGHT_COINS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
  SERVER_BOOST_ICON,
} from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

export interface GuildMemberUpdateListener extends Listener {
  event: Events.GuildMemberUpdate;
  fn: (
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ) => Awaitable<void>;
}

const REWARD_AMOUNT = 500;

export const guildMemberUpdate: GuildMemberUpdateListener = {
  event: Events.GuildMemberUpdate,
  fn: async (
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ) => {
    // SERVER BOOSTED
    if (oldMember.premiumSince !== newMember.premiumSince) {
      const guild = await prisma.guild.findUnique({
        where: { discordId: oldMember.guild.id },
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

      await updateBalance(oldMember.client, {
        user: {
          id: oldMember.id,
          name: oldMember.displayName,
          iconURL: oldMember.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: REWARD_AMOUNT,
        reason: `You have been awarded ${REWARD_AMOUNT} ${guildCurrency.namePlural} for boosting the server`,
      });

      const boughtCoinsGuildChannel = await prisma.guildChannel.findFirst({
        where: {
          guildId: guild.id,
          name: BOUGHT_COINS_CHANNEL_NAME,
        },
      });
      if (!boughtCoinsGuildChannel) return;

      const boughtCoinsChannel = (await getChannelById(
        oldMember.client,
        boughtCoinsGuildChannel.discordId
      )) as TextChannel;
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Server Boosted")
        .setImage(SERVER_BOOST_ICON)
        .setAuthor({
          name: oldMember.user.username,
          iconURL: oldMember.user.avatarURL() || undefined,
        });
      boughtCoinsChannel.send({
        embeds: [embed],
      });
    }

    return;
  },
};
