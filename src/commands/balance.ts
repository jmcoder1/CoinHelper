import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { endInteraction } from "./utils/endnteraction";

export const Balance: Command = {
  name: "balance",
  description: "Get your balance",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild not found.");

    const balance = await unbelievaboatClient.getUserBalance(
      interactionGuild.id,
      interaction.user.id
    );

    const economyChannel = await getChannelById(
      client,
      guildInfo.channels.economyChannelId
    );
    if (!economyChannel)
      return endInteraction(interaction, "Economy channel not found.");

    if (!economyChannel.isTextBased())
      return endInteraction(interaction, "Economy channel is not text-based.");

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Balance")
      .setImage(getRandElement(guildInfo.images.currency))
      .addFields({
        name: "Total balance",
        value: `${balance.total} ${guildInfo.currencyPluralName}`,
      })
      .addFields({
        name: "Cash balance",
        value: `${balance.cash} ${guildInfo.currencyPluralName}`,
      })
      .addFields({
        name: "Rank",
        value: `Rank ${balance.rank}`,
      });

    await economyChannel.send(`<@${interaction.user.id}>`);
    await economyChannel.send({ embeds: [resultEmbed] });

    return endInteraction(
      interaction,
      `Check your balance in <#${guildInfo.channels.economyChannelId}>!`
    );
  },
};
