const DEFAULT_CURRENCY_EMOJI = "💰";

export const formatCurrencyEmojiForLabel = (currencyImage: string): string => {
  const trimmed = currencyImage.trim();
  if (
    !trimmed ||
    trimmed.startsWith("http") ||
    trimmed.includes("<:") ||
    trimmed.length > 4
  ) {
    return DEFAULT_CURRENCY_EMOJI;
  }

  return trimmed;
};
