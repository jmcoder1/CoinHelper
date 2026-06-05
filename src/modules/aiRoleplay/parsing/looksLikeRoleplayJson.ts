export const looksLikeRoleplayJson = (raw: string): boolean => {
  const trimmed = raw.trim();

  return trimmed.startsWith("{") || trimmed.includes('"story"');
};
