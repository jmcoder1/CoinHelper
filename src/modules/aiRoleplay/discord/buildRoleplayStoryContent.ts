import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildRoleplayActorLine } from "./buildRoleplayActorLine";

export const buildRoleplayStoryContent = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
): string => {
  const lines: string[] = [];

  if (context.actorAction === "triggered" && context.selectedRoleLabel) {
    lines.push(`**Role:** ${context.selectedRoleLabel}`);
  }

  if (context.selectedChoice) {
    lines.push(`**Choice:** ${context.selectedChoice}`);
  }

  lines.push(buildRoleplayActorLine(context), "", parsed.story);

  return lines.join("\n");
};
