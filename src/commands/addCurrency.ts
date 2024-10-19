import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";

export const AddCurrency: Command = {
  name: "add-currency",
  description: "Add curerncy to any member",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "recipient",
      description: "Recipient",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild || !interaction.user) return;

    const guildInfo = getGuildInfoById(interaction.guild.id);
    if (!guildInfo) return null;

    const loadingImage = getRandElement(guildInfo.images.loading);
    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Adding ${guildInfo.currencyPluralName}...`)
      .setImage(loadingImage);

    interaction.reply({ embeds: [delayEmebd] });

    const amount = interaction.options.get("amount")?.value as number;
    const recipient = interaction.options.get("recipient")?.value as string;
    const reason = interaction.options.get("reason")?.value as string;
    await unbelievaboatClient.editUserBalance(
      interaction.guild.id,
      recipient,
      { cash: amount },
      reason
    );

    const economyChannel = (await client.channels.fetch(
      guildInfo.channels.economyChannelId
    )) as TextChannel;
    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guildInfo.currencyPluralName} Updated`)
      .setImage(
        "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
      )
      .addFields({
        name: amount > 0 ? "Added" : "Removed",
        value: `<@${recipient}> your balance has been updated by ${amount} ${guildInfo.currencyPluralName}`,
      });

    if (economyChannel?.isTextBased()) {
      await economyChannel.send(`<@${recipient}> ${reason}`);
      await economyChannel.send({ embeds: [resultEmbed] });
    }

    return;
  },
};
