import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";

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
    if (!interaction.guild) return;

    const guildInfo = getGuildInfoById(interaction.guild.id);
    if (!guildInfo) return null;

    const amount = interaction.options.get("amount")?.value as number;
    const recipientId = interaction.options.get("recipient")?.value as string;
    const reason = interaction.options.get("reason")?.value as string;

    const recipient = interaction.guild.members.cache.get(recipientId)?.user;
    if (!recipient) {
      await interaction.reply({
        content: "Recipient not found",
        ephemeral: true,
      });
      return;
    }

    await updateBalance(client, {
      user: {
        name: recipient.username,
        id: recipient.id,
        guild: {
          id: interaction.guild.id,
          currencyPluralName: guildInfo.currencyPluralName,
          economyChannelId: guildInfo.channels.economyChannelId,
        },
        iconURL: recipient.displayAvatarURL(),
      },
      cashAmount: amount,
      reason: reason,
    });

    return;
  },
};
