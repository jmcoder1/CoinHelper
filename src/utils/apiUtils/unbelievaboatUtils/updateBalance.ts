import { Client, EmbedBuilder } from "discord.js";
import { OnePieceHentaiZGuild } from "../../../listeners/utils/constants";
import { client as unbelievaboatClient } from "./client";
import { CURRENCY_NAME_PLURAL } from "../../constants";

interface UpdateBalanceParams {
  user: {
    name: string;
    id: string;
    iconURL: string | undefined;
  };
  cashAmount: number;
  reason: string;
}

export const updateBalance = async (
  client: Client,
  { user, cashAmount, reason }: UpdateBalanceParams
) => {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${CURRENCY_NAME_PLURAL} Update`)
    .setImage(
      "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552"
    )
    .setAuthor({
      name: user.name,
      iconURL: user.iconURL,
    })
    .addFields({ name: "Added Berries", value: "" + cashAmount })
    .addFields({ name: "Reason", value: reason });

  await unbelievaboatClient.editUserBalance(
    OnePieceHentaiZGuild.id,
    user.id,
    { cash: cashAmount },
    reason
  );
  const economyChannel = await client.channels.fetch(
    OnePieceHentaiZGuild.channels.economyChannelId
  );
  if (economyChannel?.isTextBased())
    await economyChannel.send({ embeds: [embed] });
};
