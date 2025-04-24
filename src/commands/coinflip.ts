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
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { endInteraction } from "./utils/endnteraction";

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
    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild not found.");

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
      const message = `Please enter either "heads" or "tails"`;
      embed.addFields({
        name: "Invalid face!",
        value: message,
      });
      embed.setColor(0xff0000);

      return endInteraction(interaction, message);
    }

    const amount = interaction.options.get("amount")?.value as number;
    const [userBalance, errorBalance] = await tryAsyncAwait(() =>
      unbelievaboatClient.getUserBalance(
        interactionGuild.id,
        interaction.user.id
      )
    );
    if (!userBalance || errorBalance) {
      return endInteraction(
        interaction,
        "Error fetching balance. Please try again later."
      );
    }

    const economyChannel = await client.channels.fetch(
      guildInfo.channels.economyChannelId
    );
    if (!economyChannel)
      return endInteraction(interaction, "Economy channel not found.");
    if (!economyChannel.isTextBased())
      return endInteraction(interaction, "Economy channel is not text-based.");

    const cashBalance = userBalance.cash;
    const [resValidateAmount, errorValidateAmount] = await tryAsyncAwait(() =>
      validateAmount(interaction, {
        amount,
        balance: cashBalance,
        cost: 50,
        currencyPluralName: guildInfo.currencyPluralName,
      })
    );
    if (!resValidateAmount || errorValidateAmount)
      return endInteraction(interaction, errorValidateAmount);

    const userId = interaction.user.id;
    const winChance = 0.45;
    const won = Math.random() <= winChance;

    const playChannel = await client.channels.fetch(
      guildInfo.channels.playChannelId
    );
    if (!playChannel)
      return endInteraction(interaction, "Play channel not found.");
    if (!playChannel.isTextBased())
      return endInteraction(interaction, "Play channel is not text-based.");

    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Flipping")
      .setImage(getRandElement(guildInfo.images.coinFlip))
      .setDescription(
        `Check the result in <#${guildInfo.channels.playChannelId}>`
      );
    interaction.reply({ embeds: [delayEmebd] });
    await sleep(2000);

    let reason: string;
    let cashAmount: number;

    if (won) {
      embed
        .addFields({
          name: "You won",
          value: `You have been awarded ${amount} ${guildInfo.currencyPluralName}`,
        })
        .setImage(getRandElement(guildInfo.images.gameWin));

      reason = `Coins flip won! <@${userId}> you have won ${amount} ${guildInfo.currencyPluralName}`;
      cashAmount = +amount;
    } else {
      embed
        .addFields({
          name: "You lost",
          value: `You have lost ${amount} ${guildInfo.currencyPluralName}`,
        })
        .setImage(getRandElement(guildInfo.images.gameLost));

      reason = `Coins flip lost! <@${userId}> you have lost ${amount} ${guildInfo.currencyPluralName}`;
      cashAmount = -amount;
    }

    const [, errorUpdateBalance] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: userId,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: interactionGuild.id,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
            currencyImage: guildInfo.images.currency[0],
          },
        },
        cashAmount,
        reason,
      })
    );
    if (errorUpdateBalance)
      return endInteraction(interaction, errorUpdateBalance);

    await playChannel.send(`<@${interaction.user.id}>`);
    await playChannel.send({ embeds: [embed] });

    return endInteraction(
      interaction,
      `Coin flip result sent to ${guildInfo.channels.playChannelId}`
    );
  },
};
