import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";

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
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild not found.");

    const buyerId = interaction.options.get("buyer")?.value as string;
    const amount = interaction.options.get("amount")?.value as number;

    const buyer = interactionGuild.members.cache.get(buyerId)?.user;
    if (!buyer) return endInteraction(interaction, "Buyer not found.");

    const titleReason = `${amount} ${guildInfo.currencyPluralName} Bought`;
    const [, error] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: buyer.username,
          id: buyer.id,
          guild: {
            id: interactionGuild.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyImage: guildInfo.images.currency[0],
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

    const boughtCoinsChannel = await getChannelById(
      client,
      guildInfo.channels.boughtCoinsChannelId
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
