import { AI_ROLEPLAY_END_PREFIX } from "../constants";

export const parseEndSessionButtonId = (
  customId: string,
): { sessionId: string } | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_END_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 2) return null;

  return { sessionId: parts[1] };
};
