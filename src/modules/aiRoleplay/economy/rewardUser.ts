import { Client } from "discord.js";
import { UpdateBalanceParams } from "../../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { RoleplayEconomyContext } from "../types";

export const rewardUser = async (
  client: Client,
  updateBalance: (client: Client, params: UpdateBalanceParams) => Promise<void>,
  userId: string,
  username: string,
  avatarUrl: string | undefined,
  context: RoleplayEconomyContext,
  amount: number,
  reason: string,
) => {
  if (amount === 0) return;

  await updateBalance(client, {
    user: {
      id: userId,
      name: username,
      iconURL: avatarUrl,
      guild: {
        id: context.guildDiscordId,
        currencyPluralName: context.currencyPluralName,
        currencyImage: context.currencyImage,
        economyChannelId: context.economyChannelId,
      },
    },
    cashAmount: amount,
    reason,
  });
};
