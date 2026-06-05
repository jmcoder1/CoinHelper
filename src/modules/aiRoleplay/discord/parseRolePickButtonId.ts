import { AI_ROLEPLAY_ROLE_PREFIX } from "../constants";

export const parseRolePickButtonId = (
  customId: string,
): { pendingId: string; roleIndex: number } | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_ROLE_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 3) return null;

  const roleIndex = Number(parts[2]);
  if (!Number.isInteger(roleIndex) || roleIndex < 0) return null;

  return { pendingId: parts[1], roleIndex };
};
