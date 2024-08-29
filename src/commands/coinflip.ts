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
import { CURRENCY_NAME_PLURAL } from "../utils/constants";

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
    const face = interaction.options.get("face")?.value as string;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Coin Flip")
      .setImage(
        "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
      );

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

    if (amount < 0) {
      embed.addFields({
        name: "Invalid amonut",
        value: `Please enter a positive amount`,
      });
      embed.setColor(0xff0000);
      await tryAsyncAwait(() =>
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
        })
      );
      return;
    } else if (amount < 50) {
      embed.addFields({
        name: "Invalid amonut",
        value: `Please enter an amount greater or equal to 50`,
      });
      embed.setColor(0xff0000);
      await tryAsyncAwait(() =>
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
        })
      );
    }

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;
    if (amount > cashBalance) {
      embed.addFields({
        name: "Invalid amonut",
        value: `Amount exceeds your available balance`,
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

    const userId = interaction.user.id;
    const winChance = 0.3;
    const won = Math.random() <= winChance;
    if (won) {
      embed.addFields({
        name: "You won",
        value: `You have been awarded ${amount} ${CURRENCY_NAME_PLURAL}`,
      });
      embed.setImage(
        "https://media1.tenor.com/m/Mlv8ii9SuRQAAAAC/one-piece-anime.gif"
      );
      await tryAsyncAwait(() =>
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
        })
      );
      await updateBalance(client, {
        userId,
        cashAmount: +amount,
        reason: `Coins flip won! <@${userId}> you have won ${amount} ${CURRENCY_NAME_PLURAL}`,
      });
      return;
    } else {
      embed.addFields({
        name: "You lost",
        value: `You have lost ${amount} ${CURRENCY_NAME_PLURAL}`,
      });
      embed.setImage(
        "https://media1.tenor.com/m/e_G1SKuHsAsAAAAC/chopper-one.gif"
      );
      await tryAsyncAwait(() =>
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
        })
      );
      await updateBalance(client, {
        userId,
        cashAmount: -amount,
        reason: `Coins flip lost! <@${userId}> you have lost ${amount} ${CURRENCY_NAME_PLURAL}`,
      });
      return;
    }
  },
};
