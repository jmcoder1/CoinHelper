import { AI_ROLEPLAY_MODE_PREFIX } from "../constants";

export const parseModePickButtonId = (
  customId: string,
): { pendingId: string; mode: "solo" | "duo" } | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_MODE_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 3) return null;

  const mode = parts[2];
  if (mode !== "solo" && mode !== "duo") return null;

  return { pendingId: parts[1], mode };
};
