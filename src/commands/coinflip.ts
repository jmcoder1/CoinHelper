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
import { endInteraction } from "./utils/endnteraction";
import {
  ECONOMY_CHANNEL_NAME,
  PLAY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

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

    const face = interaction.options.get("face")?.value as string;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Coin Flip")
      .setImage(guildCurrency.iconSrc)
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

    const economyChannel = await client.channels.fetch(
      economyGuildChannel.discordId
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
        currencyPluralName: guildCurrency.namePlural,
      })
    );
    if (!resValidateAmount || errorValidateAmount)
      return endInteraction(interaction, errorValidateAmount);

    const userId = interaction.user.id;
    const winChance = 0.45;
    const won = Math.random() <= winChance;

    const playGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: PLAY_CHANNEL_NAME,
      },
    });
    if (!playGuildChannel)
      return endInteraction(
        interaction,
        PLAY_CHANNEL_NAME + " channel not found."
      );

    const playChannel = await client.channels.fetch(playGuildChannel.discordId);
    if (!playChannel)
      return endInteraction(interaction, "Play channel not found.");
    if (!playChannel.isTextBased())
      return endInteraction(interaction, "Play channel is not text-based.");

    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Flipping")
      .setImage(
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWk3dWhkamd3OGRpa2ZyeHphY2N6Y3QwemVidWxrODdsdTgyanZ5cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6jqfXikz9yzhS/giphy.webp"
      )
      .setDescription(`Check the result in <#${playGuildChannel.discordId}>`);
    interaction.reply({ embeds: [delayEmebd] });
    await sleep(2000);

    let reason: string;
    let cashAmount: number;

    if (won) {
      embed
        .addFields({
          name: "You won",
          value: `You have been awarded ${amount} ${guildCurrency.namePlural}`,
        })
        .setImage(
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjlsMDlzcHQ1bHQ5a2g2cWhpbHh4MTl0YTQ0bjRyZnA5Yjc5ejVlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fNt9GxIiR6OMU/giphy.webp"
        );

      reason = `Coins flip won! <@${userId}> you have won ${amount} ${guildCurrency.namePlural}`;
      cashAmount = +amount;
    } else {
      embed
        .addFields({
          name: "You lost",
          value: `You have lost ${amount} ${guildCurrency.namePlural}`,
        })
        .setImage(
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmgxYjN2Zm5senptN3VkZDhuNTgwdnJnc29nOXQ1NXR6NGxhNjAybCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKr3nzbh5WgCFxe/giphy.webp"
        );

      reason = `Coins flip lost! <@${userId}> you have lost ${amount} ${guildCurrency.namePlural}`;
      cashAmount = -amount;
    }

    const [, errorUpdateBalance] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: userId,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
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
      `Coin flip result sent to ${playChannel.id}`
    );
  },
};
