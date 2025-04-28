import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { validateAmount } from "./utils/validateAmount";
import { getRandCollectionElement } from "../utils/mathUtils.ts/getRandCollectionElement";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { endInteraction } from "./utils/endnteraction";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  ECONOMY_CHANNEL_NAME,
  PLAY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";

export const Give: Command = {
  name: "give",
  description: "Give currency to a random member of the server who is online.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount",
      type: ApplicationCommandOptionType.Integer,
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

    const amount = interaction.options.get("amount")?.value as number;
    const [userBalance, errorBalance] = await tryAsyncAwait(() =>
      unbelievaboatClient.getUserBalance(
        interactionGuild.id,
        interaction.user.id
      )
    );
    if (!userBalance || errorBalance)
      return endInteraction(
        interaction,
        "Error fetching balance. Please try again later."
      );

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    const economyChannel = await client.channels.fetch(
      economyGuildChannel.discordId
    );
    if (!economyChannel)
      return endInteraction(interaction, "Economy channel not found.");
    if (!economyChannel?.isTextBased())
      return endInteraction(interaction, "Economy channel not found.");

    const cashBalance = userBalance.cash;
    const [res, error] = await tryAsyncAwait(() =>
      validateAmount(interaction, {
        amount,
        balance: cashBalance,
        cost: 50,
        currencyPluralName: guildCurrency.namePlural,
      })
    );
    if (!res || error) return endInteraction(interaction, error);

    // FIND THE ONLINE USER
    const onlineUsers = interactionGuild?.members.cache.filter(
      (member) =>
        member &&
        member.user.id != interaction.user.id &&
        member.user.bot == false &&
        member.presence &&
        member.presence.status === "online"
    );
    if (!onlineUsers) return;

    const randomMember = getRandCollectionElement(onlineUsers);
    if (!randomMember)
      return endInteraction(interaction, "No online members found.");

    const playGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: PLAY_CHANNEL_NAME,
      },
    });
    if (!playGuildChannel)
      return endInteraction(
        interaction,
        PLAY_CHANNEL_NAME + " channel not found."
      );

    const playChannel = await client.channels.fetch(playGuildChannel.discordId);
    if (!playChannel)
      return endInteraction(interaction, "Play channel not found.");
    if (!playChannel?.isTextBased())
      return endInteraction(interaction, "Play channel not found.");

    const [, errorUpdateBalance] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: randomMember.user.id,
          name: randomMember.user.displayName,
          iconURL: randomMember.user.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: amount,
        reason: `<@${randomMember.user.id}> you have won ${amount} ${guildCurrency.namePlural}`,
      })
    );
    if (errorUpdateBalance)
      return endInteraction(interaction, "Error updating balance.");

    const [, errorUpdateBalance_1] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: interaction.user.id,
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: -amount,
        reason: `<@${interaction.user.id}> you awarded ${amount} ${guildCurrency.namePlural}.`,
      })
    );
    if (errorUpdateBalance_1)
      return endInteraction(interaction, "Error updating balance.");

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guildCurrency.namePlural} Awarded`)
      .setImage(guildCurrency.iconSrc)
      .addFields({
        name: "You won",
        value: `<@${randomMember.user.id}> you have been randomly awarded ${amount} ${guildCurrency.namePlural} by <@${interaction.user.id}>`,
      })
      .setImage(
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjlsMDlzcHQ1bHQ5a2g2cWhpbHh4MTl0YTQ0bjRyZnA5Yjc5ejVlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fNt9GxIiR6OMU/giphy.webp"
      );

    await playChannel.send(`<@${interaction.user.id}>`);
    await playChannel.send({ embeds: [resultEmbed] });

    return endInteraction(
      interaction,
      guildCurrency.namePlural + " awarded successfully."
    );
  },
};
