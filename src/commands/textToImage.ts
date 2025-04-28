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
import { validateAmount } from "./utils/validateAmount";
import { login } from "../utils/apiUtils/novelAiUtils/endpoints/login";
import { fetchTextToImage } from "../utils/apiUtils/novelAiUtils/endpoints/fetchTextToImage";
import { uploadImage } from "../utils/apiUtils/s3Utils/uploadImage";
import AdmZip from "adm-zip";
import { BANNED_WORDS } from "../utils/apiUtils/novelAiUtils/constants";
import { toChannelURL } from "../utils/apiUtils/discordUtils/toChannelURL";
import { endInteraction } from "./utils/endnteraction";
import {
  AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

const COMMAND_COST = 25;
const BANNED_WORD_COST = 1000;

export const TextToImage: Command = {
  name: "text-to-image",
  description: "AI generate an image from text",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "prompt",
      description: "Text Prompt",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const prompt = interaction.options.get("prompt")?.value as string;
    if (!interaction.guild) return;

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

    // Fetch the economy guild channel
    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    for (let i = 0; i < BANNED_WORDS.length; i++) {
      const bannedWord = BANNED_WORDS[i];
      if (prompt.includes(bannedWord)) {
        await updateBalance(client, {
          user: {
            id: interaction.user.id,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() || undefined,
          },
          cashAmount: -BANNED_WORD_COST,
          reason: `<@${interaction.user.id}> you have been penalised ${BANNED_WORD_COST} ${guildCurrency.namePlural}.`,
        });
        return endInteraction(
          interaction,
          `You have been penalised ${BANNED_WORD_COST} ${guildCurrency.namePlural} for using a banned word in your prompt.`
        );
      }
    }

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interactionGuild.id as string,
        interaction.user.id
      )
    ).cash;

    const economyChannel = await client.channels.fetch(
      economyGuildChannel.discordId
    );
    if (!economyChannel || !economyChannel.isTextBased())
      return endInteraction(interaction, "Economy channel not found.");

    const [res, error] = await tryAsyncAwait(() =>
      validateAmount(interaction, {
        amount: COMMAND_COST,
        cost: COMMAND_COST,
        balance: cashBalance,
        currencyPluralName: guildCurrency.namePlural,
      })
    );
    if (!res || error) return endInteraction(interaction, error);

    const [resLogin, loginError] = await tryAsyncAwait(() =>
      login(process.env.NOVEL_API_USERNAME, process.env.NOVEL_API_PASSWORD)
    );
    if (loginError) return endInteraction(interaction, loginError);

    const accessToken = resLogin?.accessToken;
    if (!accessToken)
      return endInteraction(interaction, "No access token returned");

    const [resImage, resImageError] = await tryAsyncAwait(() =>
      fetchTextToImage(accessToken, {
        input: prompt,
        model: "nai-diffusion-3",
        seed: 1,
      })
    );
    if (!resImage || resImageError)
      return endInteraction(interaction, resImageError);

    const zip = new AdmZip(resImage.buffer);

    const zipEntries = zip.getEntries();
    const imageEntry = zipEntries.find(
      (entry) => entry.entryName === "image_0.png"
    );
    if (!imageEntry)
      return endInteraction(interaction, "Image not found in zip file.");

    const imageBase64 = Buffer.from(imageEntry.getData()).toString("base64");

    const [resUploadImage, resUploadImageError] = await tryAsyncAwait(() =>
      uploadImage(imageBase64)
    );
    if (resUploadImageError)
      return endInteraction(interaction, resUploadImageError);

    const imageUrl =
      "https://clzseiyrja.cloudimg.io/" +
      (await resUploadImage?.done())?.Location;

    const currentChannel = await client.channels.fetch(interaction.channelId);
    if (!currentChannel || !currentChannel.isTextBased())
      return endInteraction(interaction, "Current channel not found.");

    const aiGenImageTipsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
      },
    });
    if (!aiGenImageTipsGuildChannel)
      return endInteraction(
        interaction,
        AI_GEN_IMAGE_TIPS_CHANNEL_NAME + " channel not found."
      );

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Text to image")
      .setImage(imageUrl)
      .setDescription(`Prompt: ${prompt}`)
      .addFields({
        name: "Need help?",
        value: `Read [📷-ai-gen-image-tips](${toChannelURL({
          serverId: guild.discordId,
          channelId: aiGenImageTipsGuildChannel.discordId,
        })})`,
        inline: true,
      });

    if (currentChannel?.isTextBased()) {
      await currentChannel.send({ embeds: [resultEmbed] });
      await currentChannel.send(`<@${interaction.user.id}>`);
    }

    await updateBalance(client, {
      user: {
        id: interaction.user.id,
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
        guild: {
          id: guild.discordId,
          currencyPluralName: guildCurrency.namePlural,
          economyChannelId: economyGuildChannel.discordId,
          currencyImage: guildCurrency.iconSrc,
        },
      },
      cashAmount: -COMMAND_COST,
      reason: `<@${interaction.user.id}> you have been charged ${COMMAND_COST} ${guildCurrency.namePlural} for generating a text to image.`,
    });
    return endInteraction(
      interaction,
      `You have been charged ${COMMAND_COST} ${guildCurrency.namePlural} for generating a text to image.`
    );
  },
};
