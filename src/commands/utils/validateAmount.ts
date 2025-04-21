import { CommandInteraction } from "discord.js";
import { endInteraction } from "./endnteraction";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  balance: number;
  currencyPluralName: string;
}

export const validateAmount = async (
  interaction: CommandInteraction,
  data: ValidateAmountDataProps
): Promise<boolean> => {
  const { amount, cost, balance, currencyPluralName } = data;

  if (amount < 0) endInteraction(interaction, "Please enter a positive amount");

  if (amount < cost)
    endInteraction(
      interaction,
      `Please enter an amount greater or equal to ${cost}`
    );

  if (balance < amount)
    endInteraction(
      interaction,
      `You do not have enough ${currencyPluralName}! Please enter a lower amount`
    );

  if (amount > balance) true;

  return false;
};
