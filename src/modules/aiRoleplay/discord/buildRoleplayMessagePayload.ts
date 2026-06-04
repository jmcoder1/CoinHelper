import { EmbedBuilder } from "discord.js";
import { ParsedRoleplayResponse, RoleplayMessageContext } from "../types";
import { buildChoiceComponents } from "./buildChoiceComponents";
import { buildRoleplayMessageHeader } from "./buildRoleplayMessageHeader";

export const buildRoleplayMessagePayload = (
  parsed: ParsedRoleplayResponse,
  context: RoleplayMessageContext,
  sessionId: string,
) => {
  const header = buildRoleplayMessageHeader(context);
  const content = `${header}\n\n${parsed.story}`;
  const embeds = context.imageUrl
    ? [new EmbedBuilder().setImage(context.imageUrl)]
    : [];

  return {
    content,
    embeds,
    components: buildChoiceComponents(sessionId, parsed.choices),
  };
};
