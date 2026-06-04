export const truncateLabel = (text: string, maxLength = 80): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
