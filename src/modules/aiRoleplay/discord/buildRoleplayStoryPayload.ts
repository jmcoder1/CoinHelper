import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildChoiceComponents } from "./buildChoiceComponents";
import { buildRoleplayStoryContent } from "./buildRoleplayStoryContent";

export const buildRoleplayStoryPayload = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
  sessionId: string,
) => ({
  content: buildRoleplayStoryContent(parsed, context),
  embeds: [],
  components: buildChoiceComponents(sessionId, parsed.choices),
});
