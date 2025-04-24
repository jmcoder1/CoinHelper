import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";

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
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild not found.");

    const amount = interaction.options.get("amount")?.value as number;
    const recipientId = interaction.options.get("recipient")?.value as string;
    const reason = interaction.options.get("reason")?.value as string;

    const recipient = interactionGuild.members.cache.get(recipientId)?.user;
    if (!recipient) return endInteraction(interaction, "Recipient not found.");

    const [, error] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: recipient.username,
          id: recipient.id,
          guild: {
            id: interactionGuild.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyImage: guildInfo.images.currency[0],
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
      guildInfo.currencyPluralName + " added to " + recipient.username
    );
  },
};
