import { Client, EmbedBuilder } from "discord.js";
import { client as unbelievaboatClient } from "./client";

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

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${currencyPluralName} Update`)
    .setImage(
      "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
    )
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
