import { DISCORD_BUTTON_LABEL_MAX } from "../constants";
import { formatCurrencyEmojiForLabel } from "./formatCurrencyEmojiForLabel";

export const buildChoiceButtonLabel = (
  choice: string,
  buttonCost: number,
  currencyImage: string,
): string => {
  const currencyEmoji = formatCurrencyEmojiForLabel(currencyImage);
  const suffix = ` (${currencyEmoji} ${buttonCost})`;
  const maxChoiceLength = DISCORD_BUTTON_LABEL_MAX - suffix.length;

  if (maxChoiceLength <= 0) return suffix.trim();

  return `${choice.slice(0, maxChoiceLength)}${suffix}`;
};
