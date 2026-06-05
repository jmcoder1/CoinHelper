import { AI_ROLEPLAY_DUO_INVITE_PREFIX } from "../constants";

export const createDuoInviteButtonId = (
  pendingId: string,
  action: "accept" | "decline",
) => `${AI_ROLEPLAY_DUO_INVITE_PREFIX}:${pendingId}:${action}`;
