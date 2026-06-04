export const splitParagraphs = (raw: string): string[] =>
  raw
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
