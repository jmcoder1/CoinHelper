import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { endInteraction } from "./utils/endnteraction";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  ECONOMY_CHANNEL_NAME,
  PREVIEW_CHANNEL_NAME,
  PREVIEW_ROLE_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

const PREVIEW_COST = 25;
const NUM_PREVIEWS = 5;

export const Preview: Command = {
  name: "preview",
  description: "Preview 10 random messages in a channel of your choice",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "channel",
      description: "Preview channel",
      type: ApplicationCommandOptionType.Channel,
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
    if (PREVIEW_COST > cashBalance)
      return endInteraction(interaction, "Not enough balance.");

    // NUM IMAGES CHECK
    const channelId = interaction.options.get("channel")?.value as number;
    const channel = (await getChannelById(
      client,
      channelId.toString()
    )) as TextChannel;

    const allMessages = await channel.messages.fetch({ limit: 100 });
    let files: { attachment: string }[] = [];
    for (let i = 0; i < allMessages.size; i++) {
      const message = allMessages.at(i);
      if (!message) break;

      if (message.attachments.size > 0) {
        for (let j = 0; j < message.attachments.size; j++) {
          const attachment = message.attachments.at(j);
          if (!!attachment?.name && !!attachment.url)
            files.push({ attachment: attachment?.url });
        }
      }
    }
    if (files.length < NUM_PREVIEWS)
      return endInteraction(interaction, "Not enough images.");

    const previewGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: PREVIEW_CHANNEL_NAME,
      },
    });
    if (!previewGuildChannel)
      return endInteraction(
        interaction,
        ECONOMY_CHANNEL_NAME + " channel not found."
      );

    const previewChannel = await getChannelById(
      client,
      previewGuildChannel.discordId
    );
    if (!previewChannel || !previewChannel.isTextBased())
      return endInteraction(interaction, "Preview channel not found.");

    const userId = interaction.user.id;
    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    const [, errorBalance] = await tryAsyncAwait(() =>
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

        cashAmount: -PREVIEW_COST,
        reason: `<@${userId}> you have been charged ${PREVIEW_COST} ${guildCurrency.namePlural} for requesting a preview.`,
      })
    );
    if (errorBalance) {
      console.error("Error updating balance:", errorBalance);
      return endInteraction(interaction, "Error updating balance.");
    }

    const randomFiles = [];
    const usedIndices = new Set<number>(); // To track already used indices

    while (
      randomFiles.length < NUM_PREVIEWS &&
      usedIndices.size < files.length
    ) {
      const randomIndex = Math.floor(Math.random() * files.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomFiles.push(files[randomIndex]);
      }
    }

    if (randomFiles.length < NUM_PREVIEWS)
      return endInteraction(interaction, "Not enough images.");

    const previewGuildRole = await prisma.guildRole.findFirst({
      where: {
        guildId: guild.id,
        name: PREVIEW_ROLE_NAME,
      },
    });
    if (!previewGuildRole)
      return endInteraction(
        interaction,
        PREVIEW_ROLE_NAME + " role not found."
      );

    try {
      previewChannel.send({
        content: `<@&${previewGuildRole.discordId}> here is your preview of <#${channelId}>`,
        files: randomFiles,
      });
    } catch (error) {
      console.error("Error sending preview:", error);
      return endInteraction(interaction, "Error sending preview.");
    }

    return endInteraction(
      interaction,
      `Preview sent to <#${previewChannel.id}>`
    );
  },
};
