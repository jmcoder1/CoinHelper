import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildChoiceComponents } from "./buildChoiceComponents";
import { buildRoleplayStoryContent } from "./buildRoleplayStoryContent";

export const buildRoleplayStoryPayload = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
  sessionId: string,
  buttonCost: number,
  currencyImage: string,
  options?: { showEndButton?: boolean },
) => ({
  content: buildRoleplayStoryContent(parsed, context),
  embeds: [],
  components: buildChoiceComponents(
    sessionId,
    parsed.choices,
    buttonCost,
    currencyImage,
    options,
  ),
});
