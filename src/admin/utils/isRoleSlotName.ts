import { ROLE_SLOT_NAMES } from "../slotNames";

export const isRoleSlotName = (name: string): boolean =>
  ROLE_SLOT_NAMES.includes(name);
