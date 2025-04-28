import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  BOUGHT_COINS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

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
    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

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

    const buyerId = interaction.options.get("buyer")?.value as string;
    const amount = interaction.options.get("amount")?.value as number;

    const buyer = interactionGuild.members.cache.get(buyerId)?.user;
    if (!buyer) return endInteraction(interaction, "Buyer not found.");

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(
        interaction,
        ECONOMY_CHANNEL_NAME + " channel not found."
      );

    const titleReason = `${amount} ${guildCurrency.namePlural} Bought`;
    const [, error] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: buyer.username,
          id: buyer.id,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
          iconURL: buyer.displayAvatarURL(),
        },
        cashAmount: amount,
        reason: titleReason,
      })
    );
    if (error)
      return endInteraction(
        interaction,
        "Error updating balance. Please try again later."
      );

    const boughtCoinsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: BOUGHT_COINS_CHANNEL_NAME,
      },
    });
    if (!boughtCoinsGuildChannel)
      return endInteraction(
        interaction,
        BOUGHT_COINS_CHANNEL_NAME + " channel not found."
      );

    const boughtCoinsChannel = await getChannelById(
      client,
      boughtCoinsGuildChannel.discordId
    );
    if (!boughtCoinsChannel)
      return endInteraction(interaction, "Bought coins channel not found.");

    if (!boughtCoinsChannel.isTextBased())
      return endInteraction(
        interaction,
        "Bought coins channel is not a text channel."
      );

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(titleReason)
      .setImage(guildCurrency.iconSrc)
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
