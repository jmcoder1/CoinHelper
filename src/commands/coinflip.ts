import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { sleep } from "../utils/sleep";
import { validateAmount } from "./utils/validateAmount";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";

export const CoinFlip: Command = {
  name: "coin-flip",
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

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const face = interaction.options.get("face")?.value as string;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Coin Flip")
      .setImage(getRandElement(guildInfo.images.currency))
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

    const amount = interaction.options.get("amount")?.value as number;
    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;

    const economyChannel = (await client.channels.fetch(
      guildInfo.channels.economyChannelId
    )) as TextChannel;
    const [res, error] = await tryAsyncAwait(() =>
      validateAmount(
        {
          client,
          channelId: economyChannel.id,
          amount,
          balance: cashBalance,
          cost: 50,
          currencyPluralName: guildInfo.currencyPluralName,
        },
        {
          interaction,
          embedProps: {
            title: "Coin Flip",
            image: getRandElement(guildInfo.images.insufficientBalance),
          },
        }
      )
    );
    if (error) console.error(error);
    if (!res) return;

    const userId = interaction.user.id;
    const winChance = 0.45;
    const won = Math.random() <= winChance;

    const playChannel = await client.channels.fetch(
      guildInfo.channels.playChannelId
    );

    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Flipping")
      .setImage(getRandElement(guildInfo.images.coinFlip))
      .setDescription(
        `Check the result in <#${guildInfo.channels.playChannelId}>`
      );
    interaction.reply({ embeds: [delayEmebd] });
    await sleep(2000);

    if (won) {
      embed
        .addFields({
          name: "You won",
          value: `You have been awarded ${amount} ${guildInfo.currencyPluralName}`,
        })
        .setImage(getRandElement(guildInfo.images.gameWin));

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
        .setImage(getRandElement(guildInfo.images.gameLost));

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
