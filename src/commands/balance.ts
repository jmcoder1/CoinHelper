import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { sleep } from "../utils/sleep";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";

export const Balance: Command = {
  name: "balance",
  description: "Get your balance",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const loadingImage = getRandElement(guildInfo.images.loading);
    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Awarding ${guildInfo.currencyPluralName}...`)
      .setImage(loadingImage);

    interaction.reply({ embeds: [delayEmebd] });

    const balance = await unbelievaboatClient.getUserBalance(
      interaction.guildId as string,
      interaction.user.id
    );

    await sleep(2000);

    const economyChannel = (await getChannelById(
      client,
      guildInfo.channels.economyChannelId
    )) as TextChannel;

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

    if (economyChannel?.isTextBased()) {
      await economyChannel.send(`<@${interaction.user.id}>`);
      await economyChannel.send({ embeds: [resultEmbed] });
    }

    return;
  },
};
