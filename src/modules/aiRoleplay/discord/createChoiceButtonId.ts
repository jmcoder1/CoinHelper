import { AI_ROLEPLAY_BUTTON_PREFIX } from "../constants";

export const createChoiceButtonId = (
  sessionId: string,
  choiceIndex: number,
) => `${AI_ROLEPLAY_BUTTON_PREFIX}:${sessionId}:${choiceIndex}`;
