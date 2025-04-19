import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";

export const BoughtCoins: Command = {
  name: "bought-coins",
  description:
    "Add coins to someone who has used real world money to buy coins",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "buyer",
      description: "Buyer",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const buyerId = interaction.options.get("buyer")?.value as string;
    const amount = interaction.options.get("amount")?.value as number;

    if (!interaction.guild) return null;
    const buyer = interaction.guild.members.cache.get(buyerId);
    if (!buyer) return null;

    const titleReason = `${amount} ${guildInfo.currencyPluralName} Bought`;
    await unbelievaboatClient.editUserBalance(
      interaction.guild.id,
      buyer.user.id,
      { cash: amount },
      titleReason
    );

    const economyChannel = (await client.channels.fetch(
      guildInfo.channels.economyChannelId
    )) as TextChannel;

    const economyEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guildInfo.currencyPluralName} Updated`)
      .setImage(getRandElement(guildInfo.images.currency))
      .addFields({
        name: amount > 0 ? "Added" : "Removed",
        value: `<@${buyer.user.id}> your balance has been updated by ${amount} ${guildInfo.currencyPluralName}`,
      });

    if (economyChannel?.isTextBased()) {
      await economyChannel.send(`<@${buyer.user.id}> ${titleReason}`);
      await economyChannel.send({ embeds: [economyEmbed] });
    }

    const boughtCoinsChannel = (await getChannelById(
      client,
      guildInfo.channels.boughtCoinsChannelId
    )) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(titleReason)
      .setImage(guildInfo.images.currency[0])
      .setAuthor({
        name: buyer.user.username,
        iconURL: buyer.user.avatarURL() || undefined,
      });
    boughtCoinsChannel.send({
      embeds: [embed],
    });

    return;
  },
};
