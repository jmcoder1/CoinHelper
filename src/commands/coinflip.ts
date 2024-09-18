import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { sleep } from "../utils/sleep";
import { validateAmount } from "./utils/validateAmount";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";

export const CoinFlip: Command = {
  name: "coinflip",
  description:
    "Flip a coin and guess. Win 100% of your bet if correct, and lose it if wrong.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "face",
      description: "Heads or Tails",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const face = interaction.options.get("face")?.value as string;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Coin Flip")
      .setImage(
        "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      });
    if (
      face.charAt(0) !== "h" &&
      face.charAt(0) !== "H" &&
      face.charAt(0) !== "t" &&
      face.charAt(0) !== "T"
    ) {
      embed.addFields({
        name: "Invalid face!",
        value: `Please enter either "heads" or "tails"`,
      });
      embed.setColor(0xff0000);
      await tryAsyncAwait(() =>
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
        })
      );
      return;
    }

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const amount = interaction.options.get("amount")?.value as number;
    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;
    await validateAmount(
      {
        amount,
        cashBalance,
        cost: 50,
        currencyPluralName: guildInfo.currencyPluralName,
      },
      {
        interaction,
        embedProps: {
          title: "Coin Flip",
          image:
            "https://media1.tenor.com/m/PSQehV-u3SIAAAAC/money-expensive.gif",
        },
      }
    );

    const userId = interaction.user.id;
    const winChance = 0.45;
    const won = Math.random() <= winChance;

    const playChannel = await client.channels.fetch(
      guildInfo.channels.playChannelId
    );

    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Flipping")
      .setImage("https://www.kiddiepunk.com/zacsdrugbinge/images/3.gif")
      .setDescription(
        `Check the result in <#${guildInfo.channels.playChannelId}>`
      );
    interaction.reply({ embeds: [delayEmebd] });
    await sleep(5000);

    if (won) {
      embed
        .addFields({
          name: "You won",
          value: `You have been awarded ${amount} ${guildInfo.currencyPluralName}`,
        })
        .setImage(
          "https://media1.tenor.com/m/Mlv8ii9SuRQAAAAC/one-piece-anime.gif"
        );

      await updateBalance(client, {
        user: {
          id: userId,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: interaction.guildId,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
          },
        },
        cashAmount: +amount,
        reason: `Coins flip won! <@${userId}> you have won ${amount} ${guildInfo.currencyPluralName}`,
      });
    } else {
      embed
        .addFields({
          name: "You lost",
          value: `You have lost ${amount} ${guildInfo.currencyPluralName}`,
        })
        .setImage(
          "https://media1.tenor.com/m/e_G1SKuHsAsAAAAC/chopper-one.gif"
        );

      await updateBalance(client, {
        user: {
          id: userId,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: interaction.guildId,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
          },
        },
        cashAmount: -amount,
        reason: `Coins flip lost! <@${userId}> you have lost ${amount} ${guildInfo.currencyPluralName}`,
      });
    }

    if (playChannel?.isTextBased()) {
      await playChannel.send(`<@${interaction.user.id}>`);
      await playChannel.send({ embeds: [embed] });
    }

    return;
  },
};
