import { Client } from "discord.js";
import { OnePieceHentaiZGuild } from "../../../listeners/utils/constants";
import { client as unbelievaboatClient } from "./client";
import { CURRENCY_NAME_PLURAL } from "../../constants";

interface UpdateBalanceParams {
  userId: string;
  cashAmount: number;
  reason: string;
}

export const updateBalance = async (
  client: Client,
  { userId, cashAmount, reason }: UpdateBalanceParams
) => {
  await unbelievaboatClient.editUserBalance(
    OnePieceHentaiZGuild.id,
    userId,
    { cash: cashAmount },
    reason
  );
  const economyChannel = await client.channels.fetch(
    OnePieceHentaiZGuild.channels.economyChannelId
  );
  if (economyChannel?.isTextBased())
    await economyChannel.send(
      `<@${userId}> you have ${
        cashAmount > 0 ? "gained" : "lost"
      } ${cashAmount} ${CURRENCY_NAME_PLURAL}. Reason: ${reason}`
    );
};
