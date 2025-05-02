import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
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
  MANAGE_REQUEST_ROLE_NAME,
  SAUCE_REQUEST_CHANNEL_NAME,
  TRANSLATION_REQUEST_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

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
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("delete")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        });

        // Create a thread for the request
        await requestMessage.startThread({
          name: `Respond to request`,
          autoArchiveDuration: 1440 * 7, // 7 days
        });

        // Deduct coins from the user
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

        // Handle button interactions
        const collector = requestMessage.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 600000, // 10 minutes
        });

        endInteraction(
          interaction,
          "Request sent. Please enter more details in the thread."
        );

        collector.on(
          "collect",
          async (buttonInteraction: ButtonInteraction<"cached">) => {
            if (!buttonInteraction.member) {
              buttonInteraction.reply({
                content: "This action can only be performed in a server.",
                ephemeral: true,
              });
              return;
            }

            const manageRequestGuildRole = await prisma.guildRole.findFirst({
              where: {
                guildId: guild.id,
                name: MANAGE_REQUEST_ROLE_NAME,
              },
            });
            if (!manageRequestGuildRole) return;

            const isAdmin = buttonInteraction.member?.roles.cache.has(
              manageRequestGuildRole.discordId
            );
            const isAuthor = buttonInteraction.user.id === interaction.user.id;

            if (!isAdmin && !isAuthor) {
              buttonInteraction.reply({
                content: "You do not have permission to perform this action.",
                ephemeral: true,
              });
              return;
            }

            if (buttonInteraction.customId === "accept") {
              // Create and show the modal
              const modal = new ModalBuilder()
                .setCustomId("accept-modal")
                .setTitle("Accept Request");

              const usernameInput = new TextInputBuilder()
                .setCustomId("username")
                .setLabel("Enter the username of the fulfiller")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

              modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                  usernameInput
                )
              );

              await buttonInteraction.showModal(modal);

              try {
                const modalInteraction =
                  await buttonInteraction.awaitModalSubmit({
                    time: 15 * 60 * 1000, // 15 minutes timeout
                    filter: (i) =>
                      i.customId === "accept-modal" &&
                      i.user.id === buttonInteraction.user.id,
                  });

                const enteredUsername =
                  modalInteraction.fields.getTextInputValue("username");

                // Find the user in the guild
                const fulfiller = interactionGuild.members.cache.find(
                  (member) =>
                    member.user.username.toLowerCase() ===
                    enteredUsername.toLowerCase()
                );

                if (!fulfiller) {
                  // User not found
                  await modalInteraction.reply({
                    content: `User "${enteredUsername}" not found in the server.`,
                    ephemeral: true,
                  });
                  return;
                }

                // Update the balance of the user
                await updateBalance(client, {
                  user: {
                    name: fulfiller.user.username,
                    id: fulfiller.user.id,
                    guild: {
                      id: guild.discordId,
                      currencyPluralName: guildCurrency.namePlural,
                      economyChannelId: economyGuildChannel.discordId,
                      currencyImage: guildCurrency.iconSrc,
                    },
                    iconURL: fulfiller.user.displayAvatarURL(),
                  },
                  cashAmount: amount,
                  reason: `Bounty for fulfilling a request.`,
                });

                // Disable the "Accept" button
                const updatedComponents =
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId("accept")
                      .setLabel("Accept")
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true), // Disable the button
                    new ButtonBuilder()
                      .setCustomId("delete")
                      .setLabel("Delete")
                      .setStyle(ButtonStyle.Danger)
                  );

                await requestMessage.edit({
                  components: [updatedComponents],
                });

                await modalInteraction.reply({
                  content: `The bounty of ${amount} ${guildCurrency.namePlural} has been successfully transferred to ${fulfiller.user.username}.`,
                  ephemeral: true,
                });
              } catch (error) {
                console.error("Error handling modal submission:", error);
                await buttonInteraction.followUp({
                  content: "There was an error processing the request.",
                  ephemeral: true,
                });
              }
            } else if (buttonInteraction.customId === "delete") {
              try {
                await requestMessage.delete();
                await buttonInteraction.reply({
                  content: "The request has been deleted.",
                  ephemeral: true,
                });
              } catch (error) {
                console.error("Error deleting the request:", error);
                await buttonInteraction.reply({
                  content:
                    "Failed to delete the request. Please try again later.",
                  ephemeral: true,
                });
              }
            }
          }
        );

        return endInteraction(
          interaction,
          `Request submitted successfully in <#${channel.id}>`
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
