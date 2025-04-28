import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
} from "discord.js";
import { Command } from "./utils/types";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";

export const AddCurrency: Command = {
  name: "add-currency",
  description: "Add curerncy to any member",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "recipient",
      description: "Recipient",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason",
      type: ApplicationCommandOptionType.String,
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

    const amount = interaction.options.get("amount")?.value as number;
    const recipientId = interaction.options.get("recipient")?.value as string;
    const reason = interaction.options.get("reason")?.value as string;

    const recipient = interactionGuild.members.cache.get(recipientId)?.user;
    if (!recipient) return endInteraction(interaction, "Recipient not found.");

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

    const [, error] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: recipient.username,
          id: recipient.id,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
          iconURL: recipient.displayAvatarURL(),
        },
        cashAmount: amount,
        reason: reason,
      })
    );
    if (error)
      return endInteraction(
        interaction,
        "Error updating balance. Please try again later."
      );

    return endInteraction(
      interaction,
      guildCurrency.namePlural + " added to " + recipient.username
    );
  },
};
