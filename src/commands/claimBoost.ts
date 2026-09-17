import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  BOUGHT_COINS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { getServerBoostIconUrl } from "../utils/apiUtils/prismaUtils/getServerBoostIconUrl";

const REWARD_AMOUNT = 500;

export const ClaimBoost: Command = {
  name: "claim-boost",
  description: "Claim coins for boosting this server (once per boost period).",
  type: ApplicationCommandType.ChatInput,
  run: async (
    client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;

    const [member, memberError] = await tryAsyncAwait(() =>
      interaction.member instanceof GuildMember
        ? Promise.resolve(interaction.member)
        : interactionGuild.members.fetch(interaction.user.id)
    );
    if (!member || memberError)
      return endInteraction(interaction, "Could not load your member profile.");

    const premiumSince = member.premiumSince;
    if (!premiumSince)
      return endInteraction(
        interaction,
        "You are not currently boosting this server."
      );

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    const existingClaim = await prisma.boostClaim.findUnique({
      where: {
        guildId_userId_premiumSince: {
          guildId: guild.id,
          userId: interaction.user.id,
          premiumSince,
        },
      },
    });
    if (existingClaim)
      return endInteraction(
        interaction,
        "You already claimed the boost reward for this boost period."
      );

    const [claim, claimError] = await tryAsyncAwait(() =>
      prisma.boostClaim.create({
        data: {
          guildId: guild.id,
          userId: interaction.user.id,
          premiumSince,
          cashAmount: REWARD_AMOUNT,
        },
      })
    );
    if (!claim || claimError)
      return endInteraction(
        interaction,
        "You already claimed the boost reward for this boost period."
      );

    const [, payError] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: interaction.user.id,
          name: member.displayName,
          iconURL: member.user.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: REWARD_AMOUNT,
        reason: `You have been awarded ${REWARD_AMOUNT} ${guildCurrency.namePlural} for boosting the server`,
      })
    );
    if (payError) {
      await tryAsyncAwait(() =>
        prisma.boostClaim.delete({ where: { id: claim.id } })
      );
      return endInteraction(interaction, "Error updating balance.");
    }

    const boughtCoinsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: BOUGHT_COINS_CHANNEL_NAME,
      },
    });
    if (boughtCoinsGuildChannel) {
      const boughtCoinsChannel = (await getChannelById(
        client,
        boughtCoinsGuildChannel.discordId
      )) as TextChannel | null;
      if (boughtCoinsChannel?.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Server Boosted")
          .setImage(await getServerBoostIconUrl())
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() || undefined,
          });
        await tryAsyncAwait(() =>
          boughtCoinsChannel.send({ embeds: [embed] })
        );
      }
    }

    return endInteraction(
      interaction,
      `Claimed ${REWARD_AMOUNT} ${guildCurrency.namePlural} for boosting the server.`
    );
  },
};
