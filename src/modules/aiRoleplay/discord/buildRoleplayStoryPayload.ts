import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildChoiceComponents } from "./buildChoiceComponents";
import { buildRoleplayActorLine } from "./buildRoleplayActorLine";

export const buildRoleplayStoryPayload = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
  sessionId: string,
) => ({
  content: `${buildRoleplayActorLine(context)}\n\n${parsed.story}`,
  embeds: [],
  components: buildChoiceComponents(sessionId, parsed.choices),
});
