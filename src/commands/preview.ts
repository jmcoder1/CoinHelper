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
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { endInteraction } from "./utils/endnteraction";

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
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild)
      return endInteraction(interaction, "Guild not found.");

    const interactionGuild = interaction.guild;
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild not found.");

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

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Preview channel")
      .setImage(getRandElement(guildInfo.images.currency))
      .addFields({
        name: `${channel.name}`,
        value: `A preview of your requested channel has been granted! Please check in <#${guildInfo.channels.previewChannelId}>`,
      });
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );
    const userId = interaction.user.id;

    const [, errorBalance] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: userId,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: interactionGuild.id,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
          },
        },

        cashAmount: -PREVIEW_COST,
        reason: `<@${userId}> you have been charged ${PREVIEW_COST} ${guildInfo.currencyPluralName} for requesting a preview.`,
      })
    );
    if (!errorBalance)
      return endInteraction(interaction, "Error updating balance.");

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

    const previewChannel = await getChannelById(
      client,
      guildInfo.channels.previewChannelId
    );
    if (!previewChannel || !previewChannel.isTextBased())
      return endInteraction(interaction, "Preview channel not found.");

    previewChannel.send({
      content: `<@&${guildInfo.roles.previewRoleId}> here is your preview of <#${channelId}>`,
      files: randomFiles,
    });

    return endInteraction(interaction, `Preview sent to <#${channelId}>`);
  },
};
