import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { sleep } from "../utils/sleep";
import { validateAmount } from "./utils/validateAmount";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { getRandElement } from "../utils/mathUtils.ts/getRandElement";
import { getRandCollectionElement } from "../utils/mathUtils.ts/getRandCollectionElement";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";

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
    if (!interaction.guildId) return;

    const guildInfo = getGuildInfoById(interaction.guildId);
    if (!guildInfo) return null;

    const amount = interaction.options.get("amount")?.value as number;
    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interaction.guildId as string,
        interaction.user.id
      )
    ).cash;

    const economyChannel = (await client.channels.fetch(
      guildInfo.channels.economyChannelId
    )) as TextChannel;
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
    if (error) console.error(error);
    if (!res) return;

    // FIND THE ONLINE USER
    const onlineUsers = interaction.guild?.members.cache.filter(
      (member) => member?.presence?.status === "online" && member
    );
    if (!onlineUsers) return;
    const randomMember = getRandCollectionElement(onlineUsers) as GuildMember;

    const playChannel = await client.channels.fetch(
      guildInfo.channels.playChannelId
    );

    await updateBalance(client, {
      user: {
        id: randomMember.user.id,
        name: randomMember.user.displayName,
        iconURL: randomMember.user.avatarURL() || undefined,
        guild: {
          id: interaction.guildId,
          economyChannelId: guildInfo.channels.economyChannelId,
          currencyPluralName: guildInfo.currencyPluralName,
        },
      },
      cashAmount: amount,
      reason: `<@${randomMember.user.id}> you have won ${amount} ${guildInfo.currencyPluralName}`,
    });
    await updateBalance(client, {
      user: {
        id: interaction.user.id,
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
        guild: {
          id: interaction.guildId,
          economyChannelId: guildInfo.channels.economyChannelId,
          currencyPluralName: guildInfo.currencyPluralName,
        },
      },
      cashAmount: -amount,
      reason: `<@${interaction.user.id}> you have been awarded ${amount} ${guildInfo.currencyPluralName}.`,
    });
    await sleep(5000);
    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guildInfo.currencyPluralName} Awarded`)
      .setImage(getRandElement(guildInfo.images.currency))
      .addFields({
        name: "You won",
        value: `<@${randomMember.user.id}> you have been randomly awarded ${amount} ${guildInfo.currencyPluralName} by <@${interaction.user.id}>`,
      })
      .setImage(getRandElement(guildInfo.images.gameWin));

    if (playChannel?.isTextBased()) {
      await playChannel.send(`<@${interaction.user.id}>`);
      await playChannel.send({ embeds: [resultEmbed] });
    }

    return;
  },
};
