import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextBasedChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import {
  getValidateAmountErrorMessage,
} from "./utils/validateAmount";
import { uploadImage } from "../utils/apiUtils/s3Utils/uploadImage";
import { generateImage } from "../utils/apiUtils/huggingFace/generateImage";
import { BANNED_WORDS } from "../utils/apiUtils/huggingFace/constants";
import { bufferMagicHex } from "../utils/apiUtils/huggingFace/bufferMagicHex";
import { editReplySafe } from "../utils/apiUtils/huggingFace/editReplySafe";
import { promptPreview } from "../utils/apiUtils/huggingFace/promptPreview";
import { logTextToImageStep } from "../utils/apiUtils/huggingFace/logging/textToImageStepLog";
import { logTextToImageStepError } from "../utils/apiUtils/huggingFace/logging/textToImageStepError";
import { toChannelURL } from "../utils/apiUtils/discordUtils/toChannelURL";
import { endInteraction } from "./utils/endnteraction";
import {
  AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
  AI_IMAGE_CHANNEL_NAME,
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
  run: async (
    client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    const interactionId = interaction.id;
    const prompt = interaction.options.get("prompt")?.value as string;

    logTextToImageStep(interactionId, "command received", {
      userId: interaction.user.id,
      username: interaction.user.username,
      channelId: interaction.channelId,
      promptLength: prompt?.length ?? 0,
      promptPreview: prompt ? promptPreview(prompt) : "(empty)",
    });

    if (!interaction.guild) {
      logTextToImageStep(interactionId, "abort: no guild");
      return endInteraction(interaction, "Guild not found.");
    }

    const interactionGuild = interaction.guild;

    logTextToImageStep(interactionId, "deferring reply (ack within Discord 3s window)");
    const [, deferErr] = await tryAsyncAwait(() =>
      interaction.deferReply({ ephemeral: true })
    );
    if (deferErr) {
      logTextToImageStepError(interactionId, "deferReply failed", deferErr);
      return false;
    }
    logTextToImageStep(interactionId, "deferReply ok");

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) {
      logTextToImageStep(interactionId, "abort: guild not in DB", {
        guildDiscordId: interactionGuild.id,
      });
      await editReplySafe(interactionId, interaction, "Guild not found.");
      return true;
    }

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) {
      logTextToImageStep(interactionId, "abort: guild currency missing", { guildId: guild.id });
      await editReplySafe(
        interactionId,
        interaction,
        "Guild currency not found."
      );
      return true;
    }

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) {
      logTextToImageStep(interactionId, "abort: economy channel missing", { guildId: guild.id });
      await editReplySafe(
        interactionId,
        interaction,
        "Economy channel not found."
      );
      return true;
    }

    const aiImageGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: AI_IMAGE_CHANNEL_NAME,
      },
    });
    if (!aiImageGuildChannel) {
      logTextToImageStep(interactionId, "abort: ai-image channel missing", { guildId: guild.id });
      await editReplySafe(
        interactionId,
        interaction,
        AI_IMAGE_CHANNEL_NAME + " channel not found."
      );
      return true;
    }

    logTextToImageStep(interactionId, "db lookups ok", {
      guildId: guild.id,
      economyChannelDiscordId: economyGuildChannel.discordId,
      aiImageChannelDiscordId: aiImageGuildChannel.discordId,
    });

    const lowerPrompt = prompt.toLowerCase();
    for (let i = 0; i < BANNED_WORDS.length; i++) {
      const bannedWord = BANNED_WORDS[i];
      if (lowerPrompt.includes(bannedWord)) {
        logTextToImageStep(interactionId, "banned word hit — applying penalty", {
          matchedToken: bannedWord,
        });
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
        logTextToImageStep(interactionId, "penalty balance update finished");
        await editReplySafe(
          interactionId,
          interaction,
          `You have been penalised ${BANNED_WORD_COST} ${guildCurrency.namePlural} for using a banned word in your prompt.`
        );
        return true;
      }
    }

    logTextToImageStep(interactionId, "banned-word check passed");

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interactionGuild.id as string,
        interaction.user.id
      )
    ).cash;

    logTextToImageStep(interactionId, "fetched cash balance", {
      cashBalance,
      commandCost: COMMAND_COST,
    });

    const amountError = getValidateAmountErrorMessage({
      amount: COMMAND_COST,
      cost: COMMAND_COST,
      balance: cashBalance,
      currencyPluralName: guildCurrency.namePlural,
    });
    if (amountError) {
      logTextToImageStep(interactionId, "abort: validateAmount failed (user notified)", {
        amountError,
      });
      await editReplySafe(interactionId, interaction, amountError);
      return true;
    }

    logTextToImageStep(interactionId, "validateAmount passed");

    const aiImageChannel = await client.channels.fetch(
      aiImageGuildChannel.discordId
    );
    if (!aiImageChannel || !aiImageChannel.isTextBased()) {
      logTextToImageStep(interactionId, "abort: ai-image Discord channel missing or not text", {
        fetched: Boolean(aiImageChannel),
        isTextBased: aiImageChannel?.isTextBased?.() ?? false,
      });
      await editReplySafe(
        interactionId,
        interaction,
        AI_IMAGE_CHANNEL_NAME + " channel not found."
      );
      return true;
    }

    const aiImageChannelUrl = toChannelURL({
      serverId: guild.discordId,
      channelId: aiImageGuildChannel.discordId,
    });

    logTextToImageStep(interactionId, "editReply: generating ack", {
      aiImageChannelId: aiImageGuildChannel.discordId,
    });

    const ackOk = await editReplySafe(
      interactionId,
      interaction,
      `Generating your image... It will be posted in [#${AI_IMAGE_CHANNEL_NAME}](${aiImageChannelUrl}) in a few seconds.`
    );
    if (!ackOk) return false;

    logTextToImageStep(interactionId, "generating ack sent — starting background generation");

    void runGeneration(client, interaction, {
      prompt,
      guildDiscordId: guild.discordId,
      currencyPluralName: guildCurrency.namePlural,
      currencyImage: guildCurrency.iconSrc,
      economyChannelId: economyGuildChannel.discordId,
      aiImageChannel: aiImageChannel as TextBasedChannel,
      aiImageChannelUrl,
      guildId: guild.id,
    });

    return true;
  },
};

interface RunGenerationOpts {
  prompt: string;
  guildDiscordId: string;
  currencyPluralName: string;
  currencyImage: string;
  economyChannelId: string;
  aiImageChannel: TextBasedChannel;
  aiImageChannelUrl: string;
  guildId: number;
}

const runGeneration = async (
  client: Client,
  interaction: CommandInteraction,
  opts: RunGenerationOpts
): Promise<void> => {
  const interactionId = interaction.id;
  const {
    prompt,
    guildDiscordId,
    currencyPluralName,
    currencyImage,
    economyChannelId,
    aiImageChannel,
    guildId,
  } = opts;

  logTextToImageStep(interactionId, "runGeneration started", {
    userId: interaction.user.id,
    aiImageChannelId: aiImageChannel.id,
    guildDiscordId,
    guildId,
  });

  const notifyFailure = async (message: string) => {
    logTextToImageStep(interactionId, "notifyFailure (editReply)", { message });
    const [, err] = await tryAsyncAwait(() =>
      interaction.editReply({ content: message })
    );
    if (err) {
      logTextToImageStepError(interactionId, "editReply (failure message) failed", err, {
        message,
      });
    } else {
      logTextToImageStep(interactionId, "failure editReply sent ok");
    }
  };

  logTextToImageStep(interactionId, "calling generateImage (Hugging Face)");
  const [resImage, resImageError] = await tryAsyncAwait(() =>
    generateImage(prompt, interactionId)
  );
  if (!resImage || resImageError) {
    logTextToImageStepError(interactionId, "generateImage failed", resImageError);
    await notifyFailure(
      "Image generation failed. You have not been charged. Please try again later."
    );
    return;
  }

  logTextToImageStep(interactionId, "generateImage ok", {
    seed: resImage.seed,
    sourceUrlLength: resImage.url.length,
    sourceUrlPrefix: resImage.url.slice(0, 250),
    sourceUrlIsAbsolute: /^https?:\/\//i.test(resImage.url),
  });

  logTextToImageStep(interactionId, "fetching image bytes from Gradio URL");
  const [downloadRes, downloadError] = await tryAsyncAwait(() =>
    fetch(resImage.url)
  );
  if (!downloadRes || !downloadRes.ok || downloadError) {
    logTextToImageStepError(interactionId, "download failed", downloadError, {
      hasResponse: Boolean(downloadRes),
      status: downloadRes?.status,
      statusText: downloadRes?.statusText,
      ok: downloadRes?.ok,
    });
    await notifyFailure(
      "Failed to download the generated image. You have not been charged. Please try again later."
    );
    return;
  }

  const contentType = downloadRes.headers.get("content-type");
  const contentLength = downloadRes.headers.get("content-length");

  logTextToImageStep(interactionId, "download HTTP ok", {
    status: downloadRes.status,
    contentType,
    contentLength,
  });

  const [buffer, bufferError] = await tryAsyncAwait(() =>
    downloadRes.arrayBuffer()
  );
  if (!buffer || bufferError) {
    logTextToImageStepError(interactionId, "arrayBuffer failed", bufferError);
    await notifyFailure(
      "Failed to read the generated image. You have not been charged. Please try again later."
    );
    return;
  }

  const magic = bufferMagicHex(buffer);
  logTextToImageStep(interactionId, "image buffer read", {
    byteLength: buffer.byteLength,
    magicHexPrefix: magic,
    looksPng: magic.startsWith("89504e47"),
    looksJpeg: magic.startsWith("ffd8ff"),
  });

  if (buffer.byteLength < 512) {
    logTextToImageStep(interactionId, "warning: very small buffer — likely not a real image", {
      byteLength: buffer.byteLength,
    });
  }

  const imageBase64 = Buffer.from(buffer).toString("base64");
  logTextToImageStep(interactionId, "base64 encoded for S3", {
    base64Length: imageBase64.length,
  });

  logTextToImageStep(interactionId, "starting S3 upload");
  const [resUploadImage, resUploadImageError] = await tryAsyncAwait(() =>
    uploadImage(imageBase64)
  );
  if (!resUploadImage || resUploadImageError) {
    logTextToImageStepError(interactionId, "S3 upload init failed", resUploadImageError);
    await notifyFailure(
      "Failed to store the generated image. You have not been charged. Please try again later."
    );
    return;
  }

  const [uploadResult, uploadResultError] = await tryAsyncAwait(() =>
    resUploadImage.done()
  );
  if (!uploadResult || uploadResultError) {
    logTextToImageStepError(interactionId, "S3 upload done() failed", uploadResultError);
    await notifyFailure(
      "Failed to store the generated image. You have not been charged. Please try again later."
    );
    return;
  }

  const rawLocation = uploadResult.Location ?? "";
  // S3 CompleteMultipartUpload returns a full https://... URL in Location.
  // Do not prefix cloudimg or you get two URLs in one string and Discord embeds break.
  const imageUrl = /^https?:\/\//i.test(rawLocation)
    ? rawLocation
    : `https://clzseiyrja.cloudimg.io/${rawLocation}`;

  logTextToImageStep(interactionId, "S3 upload complete", {
    location: uploadResult.Location,
    bucketKey: uploadResult.Key,
    finalImageUrl: imageUrl,
  });

  const tipsGuildChannel = await prisma.guildChannel.findFirst({
    where: {
      guildId,
      name: AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
    },
  });

  logTextToImageStep(interactionId, "tips channel lookup", {
    found: Boolean(tipsGuildChannel),
    tipsChannelId: tipsGuildChannel?.discordId,
  });

  const resultEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Text to image")
    .setImage(imageUrl)
    .setDescription(`Prompt: ${prompt}`);

  if (tipsGuildChannel) {
    resultEmbed.addFields({
      name: "Need help?",
      value: `Read [📷-ai-gen-image-tips](${toChannelURL({
        serverId: guildDiscordId,
        channelId: tipsGuildChannel.discordId,
      })})`,
      inline: true,
    });
  }

  logTextToImageStep(interactionId, "posting embed to ai-image channel", {
    embedImageUrl: imageUrl,
  });

  const [postedMessage, postError] = await tryAsyncAwait(() =>
    aiImageChannel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [resultEmbed],
    })
  );
  if (postError || !postedMessage) {
    logTextToImageStepError(interactionId, "channel.send failed", postError);
    await notifyFailure(
      "Image was generated but could not be posted. You have not been charged. Please try again later."
    );
    return;
  }

  logTextToImageStep(interactionId, "posted to ai-image channel", {
    messageId: postedMessage.id,
    messageUrl: postedMessage.url,
  });

  logTextToImageStep(interactionId, "charging user balance", {
    amount: -COMMAND_COST,
    currencyPluralName,
  });

  const [, chargeError] = await tryAsyncAwait(() =>
    updateBalance(client, {
      user: {
        id: interaction.user.id,
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
        guild: {
          id: guildDiscordId,
          currencyPluralName,
          economyChannelId,
          currencyImage,
        },
      },
      cashAmount: -COMMAND_COST,
      reason: `<@${interaction.user.id}> you have been charged ${COMMAND_COST} ${currencyPluralName} for generating a text to image.`,
    })
  );
  if (chargeError) {
    logTextToImageStepError(
      interactionId,
      "charge failed (image was already posted)",
      chargeError
    );
  } else {
    logTextToImageStep(interactionId, "charge succeeded — runGeneration complete");
  }

  const [, finalEditErr] = await tryAsyncAwait(() =>
    interaction.editReply({
      content: chargeError
        ? `Your image was posted in <#${aiImageChannel.id}>. There was an error updating your balance — please contact staff.`
        : `Your image was posted in <#${aiImageChannel.id}>. You were charged ${COMMAND_COST} ${currencyPluralName}.`,
    })
  );
  if (finalEditErr) {
    logTextToImageStepError(interactionId, "final success editReply failed", finalEditErr);
  }
};
