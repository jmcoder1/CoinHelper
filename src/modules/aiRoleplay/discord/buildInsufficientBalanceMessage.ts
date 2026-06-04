export const buildInsufficientBalanceMessage = (
  cost: number,
  balance: number,
  currencyPluralName: string,
): string =>
  `You need ${cost} ${currencyPluralName} but only have ${balance} ${currencyPluralName}.`;
