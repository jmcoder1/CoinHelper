import { RoleplayMessageContext } from "../types";
import { buildRoleplayActorLine } from "./buildRoleplayActorLine";

export const buildRoleplayMessageHeader = (
  context: RoleplayMessageContext,
): string => {
  const sourceLine = `<@${context.sourceAuthorId}> [original message](${context.sourceMessageUrl})`;
  const roleLine =
    context.actorAction === "triggered" && context.selectedRoleLabel
      ? `**Role:** ${context.selectedRoleLabel}`
      : null;
  const actorLine = buildRoleplayActorLine(context);

  return [sourceLine, roleLine, actorLine].filter(Boolean).join("\n");
};
