import { RoleplaySession } from "@prisma/client";

export const getActivePlayerRolePrompt = (session: RoleplaySession): string => {
  if (session.currentTurnUserId === session.initiatorId) {
    return session.selectedRolePrompt;
  }

  return session.partnerRolePrompt;
};
