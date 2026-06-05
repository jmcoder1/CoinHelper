import { RoleplaySession } from "@prisma/client";

export const getPlayerRolePromptForUser = (
  session: RoleplaySession,
  userId: string,
): string =>
  userId === session.initiatorId
    ? session.selectedRolePrompt
    : session.partnerRolePrompt;

export const getPlayerRoleLabelForUser = (
  session: RoleplaySession,
  userId: string,
): string =>
  userId === session.initiatorId
    ? session.selectedRoleLabel
    : session.partnerRoleLabel;
