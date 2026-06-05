import { AI_ROLEPLAY_MODE_PREFIX } from "../constants";

export const createModePickButtonId = (
  pendingId: string,
  mode: "solo" | "duo",
) => `${AI_ROLEPLAY_MODE_PREFIX}:${pendingId}:${mode}`;
