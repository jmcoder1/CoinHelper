import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildRoleplayActorLine } from "./buildRoleplayActorLine";

const buildRolesLine = (context: RoleplayMessageContext): string | null => {
  if (
    context.mode === "duo" &&
    context.initiatorId &&
    context.partnerId &&
    context.initiatorRoleLabel &&
    context.partnerRoleLabel
  ) {
    return `**Roles:** <@${context.initiatorId}> (${context.initiatorRoleLabel}) · <@${context.partnerId}> (${context.partnerRoleLabel})`;
  }

  if (
    context.actorAction === "triggered" &&
    context.selectedRoleLabel
  ) {
    return `**Role:** ${context.selectedRoleLabel}`;
  }

  return null;
};

export const buildRoleplayStoryContent = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
): string => {
  const lines: string[] = [];

  const rolesLine = buildRolesLine(context);
  if (rolesLine) {
    lines.push(rolesLine);
  }

  if (
    context.mode === "duo" &&
    context.turnUserId &&
    (context.actorAction === "triggered" || context.actorAction === "continued")
  ) {
    lines.push(`**Turn:** <@${context.turnUserId}>`);
  }

  if (context.selectedChoice) {
    lines.push(`**Choice:** ${context.selectedChoice}`);
  }

  lines.push(buildRoleplayActorLine(context), "", parsed.story);

  return lines.join("\n");
};
