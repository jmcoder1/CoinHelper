import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { createModePickButtonId } from "./createModePickButtonId";

export const buildModePickComponents = (
  pendingId: string,
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  row.addComponents(
    new ButtonBuilder()
      .setCustomId(createModePickButtonId(pendingId, "solo"))
      .setLabel("Solo")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(createModePickButtonId(pendingId, "duo"))
      .setLabel("Duo Roleplay")
      .setStyle(ButtonStyle.Secondary),
  );

  return [row];
};
