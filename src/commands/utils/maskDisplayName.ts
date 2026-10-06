/** Keep the first 3 characters and replace the rest with asterisks. */
export const maskDisplayName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "***";
  if (trimmed.length <= 3) {
    return `${trimmed[0]}${"*".repeat(Math.max(trimmed.length - 1, 1))}`;
  }
  return `${trimmed.slice(0, 3)}${"*".repeat(trimmed.length - 3)}`;
};
