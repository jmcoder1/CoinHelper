import { guildMemberUpdate } from "./guildMemberUpdate";
import { interactionCreate } from "./interactionCreate";
import { dmMessageCreate } from "./dmMessageCreate";
import { messageCreate } from "./messageCreate";
import { messageDelete } from "./messageDelete";
import { messageReactionAdd } from "./messageReactionAdd";
import { messageReactionRemove } from "./messageReactionRemove";
import { ready } from "./ready";

export const listeners = [
  ready,
  messageCreate,
  dmMessageCreate,
  messageDelete,
  interactionCreate,
  guildMemberUpdate,
  messageReactionAdd,
  messageReactionRemove,
] as const;
