import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { endInteraction } from "./utils/endnteraction";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  ECONOMY_CHANNEL_NAME,
  PARTNER_UPSELL_URL,
} from "../utils/apiUtils/prismaUtils/constants";
import { maybeSendPartnerPromo } from "../utils/apiUtils/unbelievaboatUtils/maybeSendPartnerPromo";

export const Balance: Command = {
  name: "balance",
  description: "Get your balance",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (
    client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;

    const balance = await unbelievaboatClient.getUserBalance(
      interactionGuild.id,
      interaction.user.id
    );

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    // Fetch the guild currency
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
      return endInteraction(
        interaction,
        ECONOMY_CHANNEL_NAME + " channel not found."
      );

    const economyChannel = await getChannelById(
      client,
      economyGuildChannel.discordId
    );
    if (!economyChannel)
      return endInteraction(interaction, "Economy channel not found.");

    if (!economyChannel.isTextBased())
      return endInteraction(interaction, "Economy channel is not text-based.");

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Balance")
      .setImage(guildCurrency.iconSrc)
      .addFields({
        name: "Total balance",
        value: `${balance.total} ${guildCurrency.namePlural}`,
      })
      .addFields({
        name: "Cash balance",
        value: `${balance.cash} ${guildCurrency.namePlural}`,
      })
      .addFields({
        name: "Rank",
        value: `Rank ${balance.rank}`,
      });

    await economyChannel.send(`<@${interaction.user.id}>`);
    await economyChannel.send({ embeds: [resultEmbed] });
    try {
      await maybeSendPartnerPromo(
        economyChannel,
        interactionGuild.id,
        interaction.user.id,
        Date.now(),
        PARTNER_UPSELL_URL,
      );
    } catch (promoError) {
      console.error(
        `Partner promo failed: guild=${interactionGuild.id} user=${interaction.user.id}`,
        promoError instanceof Error ? promoError.message : promoError,
      );
    }

    return endInteraction(
      interaction,
      `Check your balance in <#${economyGuildChannel.discordId}>!`
    );
  },
};
