import { AI_ROLEPLAY_DUO_INVITE_PREFIX } from "../constants";

export const parseDuoInviteButtonId = (
  customId: string,
): { pendingId: string; action: "accept" | "decline" } | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_DUO_INVITE_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 3) return null;

  const action = parts[2];
  if (action !== "accept" && action !== "decline") return null;

  return { pendingId: parts[1], action };
};
