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
import { CURRENCY_NAME_PLURAL } from "../utils/constants";

const PREVIEW_COST = 50;
const NUM_PREVIEWS = 10;

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
    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;
    if (PREVIEW_COST > cashBalance) {
      const embed = new EmbedBuilder().addFields({
        name: `Not enough ${CURRENCY_NAME_PLURAL}`,
        value: `You do not have enough ${CURRENCY_NAME_PLURAL} to request a preivew`,
      });
      embed.setColor(0xff0000);
      return;
    }

    const channelId = interaction.options.get("channel")?.value as number;
    const channel = (await getChannelById(
      client,
      channelId.toString()
    )) as TextChannel;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Preview channel")
      .setImage(
        "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
      )
      .addFields({
        name: `${channel.name}`,
        value: `A preview of your requested channel has been granted! Please check in <#1278515096233967616>`,
      });
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );
    const userId = interaction.user.id;
    await updateBalance(client, {
      user: {
        id: userId,
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      },
      cashAmount: -PREVIEW_COST,
      reason: `<@${userId}> you have been charged ${PREVIEW_COST} ${CURRENCY_NAME_PLURAL} for requesting a preview.`,
    });

    const allMessages = await channel.messages.fetch({ limit: 100 });
    let files: { attachment: string }[] = [];
    for (let i = 0; i < allMessages.size; i++) {
      const message = allMessages.at(i);
      if (!message) break;

      if (message.attachments.size > 0) {
        for (let j = 0; j < message.attachments.size; j++) {
          const attachment = message.attachments.at(j);
          if (attachment?.name && attachment.url)
            files.push({ attachment: attachment?.url });
        }
      }
    }

    const randomFiles = [];
    const r = new Array(NUM_PREVIEWS)
      .fill(0)
      .map((_) => (Math.random() * NUM_PREVIEWS) | 0);
    for (let i = 0; i < r.length; i++) {
      randomFiles.push(files[r[i]]);
    }

    const previewChannel = (await getChannelById(
      client,
      "1278515096233967616"
    )) as TextChannel;
    previewChannel.send({
      content: `<@${userId}> here is your preview of <#${channelId}>`,
      files: randomFiles,
    });

    return;
  },
};
