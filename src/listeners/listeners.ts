import { guildMemberUpdate } from "./guildMemberUpdate";
import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";
import { ready } from "./ready";

export const listeners = [
  ready,
  messageCreate,
  interactionCreate,
  guildMemberUpdate,
] as const;
