import { AI_ROLEPLAY_ROLE_PREFIX } from "../constants";

export const createRolePickButtonId = (
  pendingId: string,
  roleIndex: number,
) => `${AI_ROLEPLAY_ROLE_PREFIX}:${pendingId}:${roleIndex}`;
