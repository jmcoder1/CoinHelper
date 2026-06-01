import { CHANNEL_SLOT_NAMES } from "../slotNames";

export const isChannelSlotName = (name: string): boolean =>
  CHANNEL_SLOT_NAMES.includes(name);
