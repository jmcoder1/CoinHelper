import { guildMemberUpdate } from "./guildMemberUpdate";
import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";
import { messageDelete } from "./messageDelete";
import { messageReactionAdd } from "./messageReactionAdd";
import { messageReactionRemove } from "./messageReactionRemove";
import { ready } from "./ready";

export const listeners = [
  ready,
  messageCreate,
  messageDelete,
  interactionCreate,
  guildMemberUpdate,
  messageReactionAdd,
  messageReactionRemove,
] as const;
