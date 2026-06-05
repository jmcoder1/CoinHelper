import { RoleplayMessageContext } from "../types";
import { buildRoleplayActorLine } from "./buildRoleplayActorLine";

export const buildRoleplayMessageHeader = (
  context: RoleplayMessageContext,
): string => {
  const sourceLine = `<@${context.sourceAuthorId}> [original message](${context.sourceMessageUrl})`;
  const actorLine = buildRoleplayActorLine(context);

  return `${sourceLine}\n${actorLine}`;
};
