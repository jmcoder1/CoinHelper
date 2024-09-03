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
import { getRandomImage } from "../utils/apiUtils/getRandomImage";

const COMMAND_COST = 100;

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
    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;

    const [res, error] = await tryAsyncAwait(() =>
      validateAmount(
        { amount: COMMAND_COST, cost: COMMAND_COST, cashBalance },
        {
          interaction,
          embedProps: {
            title: "Text to Image",
            image:
              "https://media1.tenor.com/m/PSQehV-u3SIAAAAC/money-expensive.gif",
          },
        }
      )
    );
    if (error) console.error(error);
    if (!res) return;

    const prompt = interaction.options.get("prompt")?.value as string;
    const delayEmebd = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Text to Image Loading...")
      .setImage(getRandomImage());

    interaction.reply({ embeds: [delayEmebd] });

    const [resLogin, loginError] = await tryAsyncAwait(() =>
      login(process.env.NOVEL_API_USERNAME, process.env.NOVEL_API_PASSWORD)
    );
    if (loginError) {
      console.error(loginError);
      return;
    }

    const accessToken = resLogin?.accessToken;
    if (!accessToken) {
      console.error("No access token returned");
      return;
    }

    const [resImage, resImageError] = await tryAsyncAwait(() =>
      fetchTextToImage(accessToken, {
        input: prompt,
        model: "nai",
        resolution: "square",
        sampling: "k_euler_ancestral",
      })
    );
    if (!resImage || resImageError) {
      console.error(resImageError);
      return null;
    }

    const zip = new AdmZip(resImage.buffer);

    const zipEntries = zip.getEntries();
    const imageEntry = zipEntries.find(
      (entry) => entry.entryName === "image_0.png"
    );
    if (!imageEntry) {
      console.error("Failed Image Entry");
      return;
    }
    const imageBase64 = Buffer.from(imageEntry.getData()).toString("base64");

    const [resUploadImage, resUploadImageError] = await tryAsyncAwait(() =>
      uploadImage(imageBase64)
    );
    if (resUploadImageError) {
      console.error(resUploadImageError);
      return;
    }
    const imageUrl =
      "https://clzseiyrja.cloudimg.io/" +
      (await resUploadImage?.done())?.Location;

    const currentChannel = await client.channels.fetch(interaction.channelId);

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Text to image")
      .setImage(imageUrl)
      .setDescription(`"${prompt}"`);

    if (currentChannel?.isTextBased())
      await currentChannel.send({ embeds: [resultEmbed] });

    return;
  },
};
