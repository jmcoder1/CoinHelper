import { client as unbelievaboatClient } from "./client";

export interface WithdrawParams {
  user: {
    id: string;
    guild: {
      id: string;
    };
  };
  amount: number;
}

export const withdraw = async ({ user, amount }: WithdrawParams) =>
  await unbelievaboatClient.editUserBalance(
    user.guild.id,
    user.id,
    {
      cash: amount,
      bank: -amount,
    },
    "Withdraw"
  );
