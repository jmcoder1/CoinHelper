import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { getValidateAmountErrorMessage } from "./utils/validateAmount";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { createRequestDeleteActionRow } from "./utils/paidRequestInteractions";
import {
  DM_REQUEST_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
  ROLEPLAY_REQUEST_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

const COMMAND_COST = 25;
const MODAL_TIMEOUT_MS = 15 * 60 * 1000;

const replyModal = async (
  modalInteraction: ModalSubmitInteraction,
  content: string
) => {
  if (modalInteraction.deferred || modalInteraction.replied) {
    await modalInteraction.editReply({ content });
    return;
  }
  await modalInteraction.reply({ content, ephemeral: true });
};

export const Request: Command = {
  name: "request",
  description: "Request something from another member",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "type",
      description: "Type of request",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "DM Request",
          value: "dm-request",
        },
        {
          name: "Roleplay Request",
          value: "roleplay-request",
        },
      ],
    },
  ],
  run: async (_: Client, interaction: CommandInteraction): Promise<boolean> => {
    // Do not deferReply before showModal — Discord only allows one initial
    // response, and showModal must be that response.
    if (!interaction.guild)
      return endInteraction(interaction, "Guild not found.");

    const interactionGuild = interaction.guild;

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    const type = interaction.options.get("type")?.value as string;

    const dmRequestGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: DM_REQUEST_CHANNEL_NAME,
      },
    });
    if (!dmRequestGuildChannel)
      return endInteraction(
        interaction,
        DM_REQUEST_CHANNEL_NAME + " channel not found."
      );

    const roleplayRequestGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ROLEPLAY_REQUEST_CHANNEL_NAME,
      },
    });
    if (!roleplayRequestGuildChannel)
      return endInteraction(
        interaction,
        ROLEPLAY_REQUEST_CHANNEL_NAME + " channel not found."
      );

    const channelId =
      type === "dm-request"
        ? dmRequestGuildChannel.discordId
        : roleplayRequestGuildChannel.discordId;

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interactionGuild.id,
        interaction.user.id
      )
    ).cash;
    const amountError = getValidateAmountErrorMessage({
      amount: COMMAND_COST,
      balance: cashBalance,
      cost: COMMAND_COST,
      currencyPluralName: guildCurrency.namePlural,
    });
    if (amountError) return endInteraction(interaction, amountError);

    const modal = new ModalBuilder()
      .setCustomId(`${type}-form`)
      .setTitle(
        type === "dm-request" ? "DM Request Form" : "Roleplay Request Form"
      );

    const kinksInput = new TextInputBuilder()
      .setCustomId("kinks")
      .setLabel("Kinks")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const limitsInput = new TextInputBuilder()
      .setCustomId("limits")
      .setLabel("Limits")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(kinksInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(limitsInput)
    );

    if (type === "roleplay-request") {
      const plotInput = new TextInputBuilder()
        .setCustomId("plot")
        .setLabel("Plot")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(plotInput)
      );
    }

    await interaction.showModal(modal);

    let modalInteraction: ModalSubmitInteraction;
    try {
      modalInteraction = await interaction.awaitModalSubmit({
        time: MODAL_TIMEOUT_MS,
        filter: (i) =>
          i.customId === `${type}-form` && i.user.id === interaction.user.id,
      });
    } catch {
      // User dismissed the modal or timed out — nothing left to acknowledge.
      return true;
    }

    try {
      await modalInteraction.deferReply({ ephemeral: true });

      const kinks = modalInteraction.fields.getTextInputValue("kinks");
      const limits = modalInteraction.fields.getTextInputValue("limits");

      let plot = "";
      if (type === "roleplay-request")
        plot = modalInteraction.fields.getTextInputValue("plot");

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(type === "dm-request" ? "DM Request" : "Roleplay Request")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setDescription(`Submitted by: <@${interaction.user.id}>`)
        .addFields(
          { name: "Kinks", value: kinks, inline: false },
          { name: "Limits", value: limits, inline: false }
        );

      if (type === "roleplay-request")
        embed.addFields({ name: "Plot", value: plot });

      const targetChannel = interactionGuild.channels.cache.get(channelId) as
        | TextChannel
        | undefined;
      if (!targetChannel || !targetChannel.isTextBased()) {
        await replyModal(modalInteraction, "Target channel not found.");
        return true;
      }

      const userAvatarURL = interaction.user.avatarURL() || undefined;

      const economyGuildChannel = await prisma.guildChannel.findFirst({
        where: {
          guildId: guild.id,
          name: ECONOMY_CHANNEL_NAME,
        },
      });
      if (!economyGuildChannel) {
        await replyModal(
          modalInteraction,
          ECONOMY_CHANNEL_NAME + " channel not found."
        );
        return true;
      }

      const [, errorBalance] = await tryAsyncAwait(() =>
        updateBalance(interaction.client, {
          user: {
            id: interaction.user.id,
            name: interaction.user.username,
            iconURL: userAvatarURL,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: -COMMAND_COST,
          reason:
            "You have been charged " +
            COMMAND_COST +
            " " +
            guildCurrency.namePlural,
        })
      );
      if (errorBalance) {
        await replyModal(modalInteraction, "Error updating balance.");
        return true;
      }

      await targetChannel.send({
        content: `Request submitted by <@${interaction.user.id}>.`,
        embeds: [embed],
        components: [createRequestDeleteActionRow(interaction.user.id)],
      });

      await replyModal(
        modalInteraction,
        "Your request has been successfully submitted in " + `<#${channelId}>`
      );
      return true;
    } catch (error) {
      console.error("Error handling modal submission:", error);
      await tryAsyncAwait(() =>
        replyModal(
          modalInteraction,
          "There was an error processing your request."
        )
      );
      return true;
    }
  },
};
