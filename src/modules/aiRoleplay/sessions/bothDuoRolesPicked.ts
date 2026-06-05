import { RoleplayPendingStart } from "@prisma/client";

export const bothDuoRolesPicked = (pending: RoleplayPendingStart): boolean =>
  Boolean(pending.initiatorRoleId && pending.partnerRoleId);
