import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";

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
  run: async (_: Client, interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const type = interaction.options.get("type")?.value as string;

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

    const whoShouldntDmInput = new TextInputBuilder()
      .setCustomId("who-shouldnt-dm")
      .setLabel("Who shouldn't DM")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const whoShouldDmInput = new TextInputBuilder()
      .setCustomId("who-should-dm")
      .setLabel("Who should DM")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(kinksInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(limitsInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        whoShouldntDmInput
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(whoShouldDmInput)
    );

    if (type === "roleplay-request") {
      const plotInput = new TextInputBuilder()
        .setCustomId("plot")
        .setLabel("Plot")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const charactersInput = new TextInputBuilder()
        .setCustomId("characters")
        .setLabel("Characters")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(plotInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(charactersInput)
      );
    }

    await interaction.showModal(modal);

    // Handle modal submission
    interaction.client.once("interactionCreate", async (modalInteraction) => {
      if (
        !modalInteraction.isModalSubmit() ||
        modalInteraction.customId !== `${type}-form`
      )
        return;

      const kinks = modalInteraction.fields.getTextInputValue("kinks");
      const limits = modalInteraction.fields.getTextInputValue("limits");
      const whoShouldntDm =
        modalInteraction.fields.getTextInputValue("who-shouldnt-dm") || "None";
      const whoShouldDm =
        modalInteraction.fields.getTextInputValue("who-should-dm") || "None";

      let plot = "";
      let characters = "";
      if (type === "roleplay-request") {
        plot = modalInteraction.fields.getTextInputValue("plot");
        characters = modalInteraction.fields.getTextInputValue("characters");
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(type === "dm-request" ? "DM Request" : "Roleplay Request")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .addFields(
          { name: "Kinks", value: kinks, inline: false },
          { name: "Limits", value: limits, inline: false },
          { name: "Who shouldn't DM", value: whoShouldntDm, inline: false },
          { name: "Who should DM", value: whoShouldDm, inline: false }
        );

      if (type === "roleplay-request") {
        embed.addFields(
          { name: "Plot", value: plot },
          { name: "Characters", value: characters }
        );
      }

      // Determine the appropriate channel
      const channelId =
        type === "dm-request"
          ? guildInfo.channels.dmRequestChannelId
          : guildInfo.channels.roleplayRequestChannelId;

      const targetChannel = interaction.guild?.channels.cache.get(
        channelId
      ) as TextChannel;
      if (!targetChannel) {
        await modalInteraction.reply({
          content: "The target channel could not be found.",
          ephemeral: true,
        });
        return;
      }

      // Send the embed to the appropriate channel
      await targetChannel.send({
        embeds: [embed],
      });

      await modalInteraction.reply({
        content:
          "Your request has been successfully submitted in " +
          `<#${channelId}>`,
        ephemeral: true,
      });
    });

    return;
  },
};
