import { AI_ROLEPLAY_BUTTON_PREFIX } from "../constants";

export const parseChoiceButtonId = (
  customId: string,
): { sessionId: string; choiceIndex: number } | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_BUTTON_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 3) return null;

  const choiceIndex = Number(parts[2]);
  if (!Number.isInteger(choiceIndex) || choiceIndex < 0) return null;

  return { sessionId: parts[1], choiceIndex };
};
