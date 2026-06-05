import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { DISCORD_BUTTON_LABEL_MAX, MAX_CHOICES } from "../constants";
import { createChoiceButtonId } from "./createChoiceButtonId";

export const buildChoiceComponents = (
  sessionId: string,
  choices: string[],
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  choices.slice(0, MAX_CHOICES).forEach((choice, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(createChoiceButtonId(sessionId, index))
        .setLabel(choice.slice(0, DISCORD_BUTTON_LABEL_MAX))
        .setStyle(ButtonStyle.Primary),
    );
  });

  return [row];
};
