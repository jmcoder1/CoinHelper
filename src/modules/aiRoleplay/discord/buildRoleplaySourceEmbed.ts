import { EmbedBuilder } from "discord.js";
import { RoleplayMessageContext } from "../types";
import { truncateLabel } from "./truncateLabel";

const EMBED_DESCRIPTION_MAX = 4096;

export const buildRoleplaySourceEmbed = (context: RoleplayMessageContext) => {
  const embed = new EmbedBuilder()
    .setURL(context.sourceMessageUrl)
    .setTitle("Original message")
    .setDescription(
      truncateLabel(context.sourceCaption ?? "(no caption)", EMBED_DESCRIPTION_MAX),
    );

  if (context.imageUrl) {
    embed.setImage(context.imageUrl);
  }

  return embed;
};
