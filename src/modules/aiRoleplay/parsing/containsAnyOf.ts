export const containsAnyOf = (
  terms: readonly string[],
  text: string,
): boolean => {
  const lower = text.toLowerCase();
  for (let i = 0; i < terms.length; i++) {
    if (lower.includes(terms[i].toLowerCase())) return true;
  }
  return false;
};
