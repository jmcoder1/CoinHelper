import {
  AI_ROLEPLAY_ROLE_PREFIX,
  ROLEPLAY_PLAYER_INITIATOR,
  ROLEPLAY_PLAYER_PARTNER,
} from "../constants";
import { RolePickPlayerSlot } from "./createRolePickButtonId";

export const parseRolePickButtonId = (
  customId: string,
): {
  pendingId: string;
  roleIndex: number;
  playerSlot: RolePickPlayerSlot | null;
} | null => {
  if (!customId.startsWith(`${AI_ROLEPLAY_ROLE_PREFIX}:`)) return null;

  const parts = customId.split(":");
  if (parts.length !== 3 && parts.length !== 4) return null;

  const roleIndex = Number(parts[2]);
  if (!Number.isInteger(roleIndex) || roleIndex < 0) return null;

  if (parts.length === 3) {
    return { pendingId: parts[1], roleIndex, playerSlot: null };
  }

  const playerSlot = parts[3];
  if (
    playerSlot !== ROLEPLAY_PLAYER_INITIATOR &&
    playerSlot !== ROLEPLAY_PLAYER_PARTNER
  ) {
    return null;
  }

  return { pendingId: parts[1], roleIndex, playerSlot };
};
