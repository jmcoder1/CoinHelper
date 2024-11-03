import { Client, EmbedBuilder } from "discord.js";
import { client as unbelievaboatClient } from "./client";
import { getGuildInfoById } from "../discordUtils/getGuildInfoById";
import { getRandElement } from "../../mathUtils.ts/getRandElement";
import { Guild } from "../discordUtils/types";

export interface UpdateBalanceParams {
  user: {
    name: string;
    id: string;
    guild: {
      id: string;
      currencyPluralName: string;
      economyChannelId: string;
    };
    iconURL: string | undefined;
  };
  cashAmount: number;
  reason: string;
}

export const updateBalance = async (
  client: Client,
  { user, cashAmount, reason }: UpdateBalanceParams
) => {
  const { guild } = user;
  const { currencyPluralName, economyChannelId } = guild;
  const guildInfo = getGuildInfoById(guild.id) as Guild;

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${currencyPluralName} Update`)
    .setImage(getRandElement(guildInfo.images.currency))
    .setAuthor({
      name: user.name,
      iconURL: user.iconURL,
    })
    .addFields({
      name: `Added ${guild.currencyPluralName}`,
      value: "" + cashAmount,
    })
    .addFields({ name: "Reason", value: reason });

  await unbelievaboatClient.editUserBalance(
    guild.id,
    user.id,
    { cash: cashAmount },
    reason
  );
  const economyChannel = await client.channels.fetch(economyChannelId);

  if (economyChannel?.isTextBased()) {
    await economyChannel.send({ embeds: [embed] });
    await economyChannel.send(`<@${user.id}>`);
  }
};
