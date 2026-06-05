import { RoleplaySession } from "@prisma/client";
import { ROLEPLAY_MODE_DUO } from "../constants";

export const getNextTurnUserId = (session: RoleplaySession): string => {
  if (session.mode !== ROLEPLAY_MODE_DUO || !session.partnerId) {
    return session.initiatorId;
  }

  return session.currentTurnUserId === session.initiatorId
    ? session.partnerId
    : session.initiatorId;
};
