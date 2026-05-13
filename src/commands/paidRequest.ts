import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { validateAmount } from "./utils/validateAmount";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  CAPTION_REQUEST_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
  SAUCE_REQUEST_CHANNEL_NAME,
  TRANSLATION_REQUEST_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { createPaidRequestActionRows } from "./utils/paidRequestInteractions";

export const PaidRequest: Command = {
  name: "paid-request",
  description: "Pay another member of the server fulfil a request",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "type",
      description: "Type of request",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Sauce request",
          value: "sauce-request",
        },
        {
          name: "Caption Request",
          value: "caption-request",
        },
        {
          name: "Transaltion Request",
          value: "translation-request",
        },
      ],
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
      return endInteraction(interaction, "Guild not found.");

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

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interactionGuild.id,
        interaction.user.id
      )
    ).cash;

    const amount = interaction.options.get("amount")?.value as
      | number
      | undefined;
    if (!amount) return endInteraction(interaction, "Amount not found.");

    const isValidAmount = validateAmount(interaction, {
      amount,
      balance: cashBalance,
      cost: 50,
      currencyPluralName: guildCurrency.namePlural,
    });
    if (!isValidAmount) return true;

    const type = interaction.options.get("type");
    if (!type) return endInteraction(interaction, "Type not found.");

    const typeValue = type?.value as string;
    if (!typeValue) return endInteraction(interaction, "Type not found.");

    if (
      typeValue === "sauce-request" ||
      typeValue === "translation-request" ||
      typeValue === "caption-request"
    ) {
      try {
        const embedTitle =
          typeValue === "sauce-request"
            ? "Sauce Request"
            : typeValue === "translation-request"
            ? "Translation Request"
            : "Caption Request";

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(embedTitle)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() || undefined,
          })
          .addFields({
            name: "Bounty",
            value: `${amount} ${guildCurrency.namePlural}`,
            inline: false,
          });

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

        const sauceRequestGuildChannel = await prisma.guildChannel.findFirst({
          where: {
            guildId: guild.id,
            name: SAUCE_REQUEST_CHANNEL_NAME,
          },
        });
        if (!sauceRequestGuildChannel)
          return endInteraction(
            interaction,
            SAUCE_REQUEST_CHANNEL_NAME + " channel not found."
          );

        const translationRequestGuildChannel =
          await prisma.guildChannel.findFirst({
            where: {
              guildId: guild.id,
              name: TRANSLATION_REQUEST_CHANNEL_NAME,
            },
          });
        if (!translationRequestGuildChannel)
          return endInteraction(
            interaction,
            TRANSLATION_REQUEST_CHANNEL_NAME + " channel not found."
          );

        const captionRequestGuildChannel = await prisma.guildChannel.findFirst({
          where: {
            guildId: guild.id,
            name: CAPTION_REQUEST_CHANNEL_NAME,
          },
        });
        if (!captionRequestGuildChannel)
          return endInteraction(
            interaction,
            CAPTION_REQUEST_CHANNEL_NAME + " channel not found."
          );

        const channelId =
          typeValue === "sauce-request"
            ? sauceRequestGuildChannel.discordId
            : typeValue === "translation-request"
            ? translationRequestGuildChannel.discordId
            : captionRequestGuildChannel.discordId;

        const channel = interactionGuild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased())
          return endInteraction(interaction, "Channel not found.");

        const requestMessage = await channel.send({
          embeds: [embed],
          content: `Respond to this request in the thread below and earn ${amount} ${guildCurrency.namePlural} if your response is accepted!`,
          components: createPaidRequestActionRows(interaction.user.id, amount),
        });

        let requestThread = null;
        try {
          requestThread = await requestMessage.startThread({
            name: `Respond to request`,
            autoArchiveDuration: 1440 * 7, // 7 days
          });
        } catch (error) {
          await requestMessage.delete().catch(() => null);
          return endInteraction(
            interaction,
            "Error creating request thread. Please try again later."
          );
        }
        if (!requestThread)
          return endInteraction(
            interaction,
            "Error creating request thread. Please try again later."
          );

        // Deduct coins from the user
        try {
          await updateBalance(client, {
            user: {
              name: interaction.user.username,
              id: interaction.user.id,
              guild: {
                id: guild.discordId,
                currencyPluralName: guildCurrency.namePlural,
                economyChannelId: economyGuildChannel.discordId,
                currencyImage: guildCurrency.iconSrc,
              },
              iconURL: interaction.user.displayAvatarURL(),
            },
            cashAmount: -amount,
            reason: `${embedTitle} created in <#${channel.id}>`,
          });
        } catch (error) {
          console.error("Error charging for paid request:", error);
          await requestMessage.delete().catch(() => null);

          return endInteraction(
            interaction,
            "Error updating balance. Please try again later."
          );
        }

        return endInteraction(
          interaction,
          `Request sent. Please enter more details in <#${requestThread.id}>.`
        );
      } catch (error) {
        return endInteraction(interaction, "Error creating request." + error);
      }
    }

    return endInteraction(
      interaction,
      "Invalid request type. Please choose a valid type."
    );
  },
};
