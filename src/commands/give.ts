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
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { getRandCollectionElement } from "../utils/mathUtils.ts/getRandCollectionElement";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { endInteraction } from "./utils/endnteraction";

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
    const guildInfo = getGuildInfoById(interactionGuild.id);
    if (!guildInfo) return endInteraction(interaction, "Guild info not found.");

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

    const economyChannel = await client.channels.fetch(
      guildInfo.channels.economyChannelId
    );
    if (!economyChannel)
      return endInteraction(interaction, "Economy channel not found.");
    if (!economyChannel?.isTextBased())
      return endInteraction(interaction, "Economy channel not found.");

    const cashBalance = userBalance.cash;
    const [res, error] = await tryAsyncAwait(() =>
      validateAmount(
        {
          client,
          channelId: economyChannel.id,
          amount,
          balance: cashBalance,
          cost: 50,
          currencyPluralName: guildInfo.currencyPluralName,
        },
        {
          interaction,
          embedProps: {
            title: "Give",
            image: getRandElement(guildInfo.images.gameLost),
          },
        }
      )
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

    const playChannel = await client.channels.fetch(
      guildInfo.channels.playChannelId
    );
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
            id: interactionGuild.id,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
          },
        },
        cashAmount: amount,
        reason: `<@${randomMember.user.id}> you have won ${amount} ${guildInfo.currencyPluralName}`,
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
            id: interactionGuild.id,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyPluralName: guildInfo.currencyPluralName,
          },
        },
        cashAmount: -amount,
        reason: `<@${interaction.user.id}> you awarded ${amount} ${guildInfo.currencyPluralName}.`,
      })
    );
    if (errorUpdateBalance_1)
      return endInteraction(interaction, "Error updating balance.");

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guildInfo.currencyPluralName} Awarded`)
      .setImage(getRandElement(guildInfo.images.currency))
      .addFields({
        name: "You won",
        value: `<@${randomMember.user.id}> you have been randomly awarded ${amount} ${guildInfo.currencyPluralName} by <@${interaction.user.id}>`,
      })
      .setImage(getRandElement(guildInfo.images.gameWin));

    await playChannel.send(`<@${interaction.user.id}>`);
    await playChannel.send({ embeds: [resultEmbed] });

    return endInteraction(interaction, "Currency awarded successfully.");
  },
};
