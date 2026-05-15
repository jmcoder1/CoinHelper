import { CommandInteraction } from "discord.js";
import { endInteraction } from "./endnteraction";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  balance: number;
  currencyPluralName: string;
}

/** For flows that already used `deferReply` — use `editReply` with this message. */
export const getValidateAmountErrorMessage = (
  data: ValidateAmountDataProps
): string | null => {
  const { amount, cost, balance, currencyPluralName } = data;

  if (amount < 0) return "Please enter a positive amount";

  if (amount < cost)
    return `Please enter an amount greater or equal to ${cost}`;

  if (balance < amount)
    return `You do not have enough ${currencyPluralName}! Please enter a lower amount`;

  return null;
};

export const validateAmount = (
  interaction: CommandInteraction,
  data: ValidateAmountDataProps
): Boolean => {
  const message = getValidateAmountErrorMessage(data);
  if (message) {
    void endInteraction(interaction, message);
    return false;
  }

  return true;
};
