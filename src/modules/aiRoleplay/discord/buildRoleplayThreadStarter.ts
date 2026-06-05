import { RoleplayMessageContext } from "../types";
import { buildRoleplayMessageHeader } from "./buildRoleplayMessageHeader";
import { buildRoleplaySourceEmbed } from "./buildRoleplaySourceEmbed";

export const buildRoleplayThreadStarter = (context: RoleplayMessageContext) => ({
  content: `${buildRoleplayMessageHeader(context)}\n\n_Continue in the thread below._`,
  embeds: [buildRoleplaySourceEmbed(context)],
});
