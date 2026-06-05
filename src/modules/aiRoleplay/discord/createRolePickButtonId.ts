import {
  AI_ROLEPLAY_ROLE_PREFIX,
  ROLEPLAY_PLAYER_INITIATOR,
  ROLEPLAY_PLAYER_PARTNER,
} from "../constants";

export type RolePickPlayerSlot =
  | typeof ROLEPLAY_PLAYER_INITIATOR
  | typeof ROLEPLAY_PLAYER_PARTNER;

export const createRolePickButtonId = (
  pendingId: string,
  roleIndex: number,
  playerSlot?: RolePickPlayerSlot,
) =>
  playerSlot
    ? `${AI_ROLEPLAY_ROLE_PREFIX}:${pendingId}:${roleIndex}:${playerSlot}`
    : `${AI_ROLEPLAY_ROLE_PREFIX}:${pendingId}:${roleIndex}`;
