import { Client, EmbedBuilder } from "discord.js";
import { client as unbelievaboatClient } from "./client";

export interface UpdateBalanceParams {
  user: {
    name: string;
    id: string;
    guild: {
      id: string;
      currencyPluralName: string;
      currencyImage: string;
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
  const { currencyPluralName, economyChannelId, currencyImage } = guild;

  const action = cashAmount > 0 ? "Added" : "Removed";

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${currencyPluralName} ${action}`)
    .setImage(currencyImage)
    .setAuthor({
      name: user.name,
      iconURL: user.iconURL,
    })
    .addFields({
      name: action,
      value: `<@${user.id}> your balance has been updated by ${cashAmount} ${currencyPluralName}`,
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
