import { guildMemberUpdate } from "./guildMemberUpdate";
import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";
import { messageReactionAdd } from "./messageReactionAdd";
import { messageReactionRemove } from "./messageReactionRemove";
import { ready } from "./ready";

export const listeners = [
  ready,
  messageCreate,
  interactionCreate,
  guildMemberUpdate,
  messageReactionAdd,
  messageReactionRemove,
] as const;
