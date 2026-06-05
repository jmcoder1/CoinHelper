import { AI_ROLEPLAY_END_PREFIX } from "../constants";

export const createEndSessionButtonId = (sessionId: string) =>
  `${AI_ROLEPLAY_END_PREFIX}:${sessionId}`;
