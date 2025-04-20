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
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";

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
    const buyer = interaction.guild.members.cache.get(buyerId)?.user;
    if (!buyer) return null;

    const titleReason = `${amount} ${guildInfo.currencyPluralName} Bought`;
    await updateBalance(client, {
      user: {
        name: buyer.username,
        id: buyer.id,
        guild: {
          id: interaction.guild.id,
          currencyPluralName: guildInfo.currencyPluralName,
          economyChannelId: guildInfo.channels.economyChannelId,
        },
        iconURL: buyer.displayAvatarURL(),
      },
      cashAmount: amount,
      reason: titleReason,
    });

    const boughtCoinsChannel = (await getChannelById(
      client,
      guildInfo.channels.boughtCoinsChannelId
    )) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(titleReason)
      .setImage(guildInfo.images.currency[0])
      .setAuthor({
        name: buyer.username,
        iconURL: buyer.avatarURL() || undefined,
      });
    boughtCoinsChannel.send({
      embeds: [embed],
    });

    return;
  },
};
