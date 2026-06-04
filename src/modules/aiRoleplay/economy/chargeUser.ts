import { Client, User } from "discord.js";
import { UpdateBalanceParams } from "../../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { RoleplayEconomyContext } from "../types";
import { buildEconomyUser } from "./buildEconomyUser";

export const chargeUser = async (
  client: Client,
  updateBalance: (client: Client, params: UpdateBalanceParams) => Promise<void>,
  user: User,
  context: RoleplayEconomyContext,
  amount: number,
  reason: string,
) => {
  if (amount === 0) return;

  await updateBalance(client, {
    user: buildEconomyUser(user, context),
    cashAmount: -amount,
    reason,
  });
};
