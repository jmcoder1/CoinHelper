import { CommandInteraction } from "discord.js";
import { endInteraction } from "./endnteraction";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  balance: number;
  currencyPluralName: string;
}

export const validateAmount = (
  interaction: CommandInteraction,
  data: ValidateAmountDataProps
): Boolean => {
  const { amount, cost, balance, currencyPluralName } = data;

  let isSuccesful = true;
  if (amount < 0) {
    endInteraction(interaction, "Please enter a positive amount");
    isSuccesful = false;
  }

  if (amount < cost) {
    endInteraction(
      interaction,
      `Please enter an amount greater or equal to ${cost}`
    );
    isSuccesful = false;
  }

  if (balance < amount) {
    endInteraction(
      interaction,
      `You do not have enough ${currencyPluralName}! Please enter a lower amount`
    );
    isSuccesful = false;
  }

  return isSuccesful;
};
