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
  COMMANDS_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { maskDisplayName } from "./utils/maskDisplayName";

export const PartnerCoins: Command = {
  name: "partner-coins",
  description:
    "Add coins for a partner signup or purchase. The shown name is partly hidden.",
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
      description: "Person who receives the coins",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "username",
      description:
        "Name to show instead of their Discord username. The end is hidden.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "reason",
      description: "Extra text added to the reason",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction,
  ): Promise<boolean> => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server.",
      );

    const interactionGuild = interaction.guild;

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    const buyerId = interaction.options.get("buyer")?.value as string;
    const amount = interaction.options.get("amount")?.value as number;
    const usernameOption = interaction.options.get("username")?.value as
      | string
      | undefined;
    const extraReason = (
      interaction.options.get("reason")?.value as string | undefined
    )?.trim();

    const [buyer, buyerError] = await tryAsyncAwait(() =>
      client.users.fetch(buyerId),
    );
    if (!buyer || buyerError)
      return endInteraction(interaction, "Buyer not found.");

    const shownName = maskDisplayName(usernameOption || buyer.username);
    const baseReason = `${amount} ${guildCurrency.namePlural} Bought`;
    const titleReason = extraReason
      ? `${baseReason}. ${extraReason}`
      : baseReason;

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(
        interaction,
        ECONOMY_CHANNEL_NAME + " channel not found.",
      );

    const [, error] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: shownName,
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
      }),
    );
    if (error)
      return endInteraction(
        interaction,
        "Error updating balance. Please try again later.",
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
        BOUGHT_COINS_CHANNEL_NAME + " channel not found.",
      );

    const boughtCoinsChannel = await getChannelById(
      client,
      boughtCoinsGuildChannel.discordId,
    );
    if (!boughtCoinsChannel)
      return endInteraction(interaction, "Bought coins channel not found.");

    if (!boughtCoinsChannel.isTextBased())
      return endInteraction(
        interaction,
        "Bought coins channel is not a text channel.",
      );

    const commandsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: COMMANDS_CHANNEL_NAME,
      },
    });
    if (!commandsGuildChannel)
      return endInteraction(
        interaction,
        COMMANDS_CHANNEL_NAME + " channel not found.",
      );

    const currentChannel = await client.channels.fetch(interaction.channelId);
    if (!currentChannel || !currentChannel.isTextBased())
      return endInteraction(interaction, "Current channel not found.");

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(titleReason)
      .setImage(guildCurrency.iconSrc)
      .setAuthor({
        name: shownName,
        iconURL: buyer.avatarURL() || undefined,
      });
    boughtCoinsChannel.send({
      embeds: [embed],
    });

    const [, sendMessageError] = await tryAsyncAwait(() =>
      currentChannel.send(
        `<@${buyer.id}> ${amount} ${guildCurrency.namePlural} have been added. Please check the Economy Commands in <#${commandsGuildChannel.discordId}>`,
      ),
    );
    if (sendMessageError)
      return endInteraction(
        interaction,
        "Balance updated, but the confirmation message could not be sent.",
      );

    return endInteraction(interaction, "Command complete successfully.");
  },
};
