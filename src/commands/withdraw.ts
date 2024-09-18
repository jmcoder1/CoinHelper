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
import { sleep } from "../utils/sleep";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { validateAmount } from "./utils/validateAmount";
import { withdraw } from "../utils/apiUtils/unbelievaboatUtils/withdraw";

export const Withdraw: Command = {
  name: "withdraw",
  description: "Withdraw Berries from your bank balance to your cash baalnce.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
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
    const amount = interaction.options.get("amount")?.value as number;
    const resValidateAmount = await validateAmount(
      {
        amount,
        balance: balance.bank,
        cost: 50,
        currencyPluralName: guildInfo.currencyPluralName,
      },
      {
        interaction,
        embedProps: {
          title: "Withdraw",
          image:
            "https://media1.tenor.com/m/PSQehV-u3SIAAAAC/money-expensive.gif",
        },
      }
    );
    if (!resValidateAmount) return;

    await sleep(2000);

    const economyChannel = (await getChannelById(
      client,
      guildInfo.channels.economyChannelId
    )) as TextChannel;

    await withdraw({
      user: { id: interaction.user.id, guild: { id: guildInfo.id } },
      amount,
    });

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Withdraw")
      .setDescription(`${amount} has been withdrawn from your bank balance`)
      .setImage(
        "https://w0.peakpx.com/wallpaper/312/357/HD-wallpaper-nami-x-berry-nami-anime-one-piece.jpg"
      );

    if (economyChannel?.isTextBased()) {
      await economyChannel.send(`<@${interaction.user.id}>`);
      await economyChannel.send({ embeds: [resultEmbed] });
    }

    return;
  },
};
