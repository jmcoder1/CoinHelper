import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { MAX_CHOICES } from "../constants";
import { createChoiceButtonId } from "./createChoiceButtonId";
import { truncateLabel } from "./truncateLabel";

export const buildChoiceComponents = (
  sessionId: string,
  choices: string[],
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  choices.slice(0, MAX_CHOICES).forEach((choice, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(createChoiceButtonId(sessionId, index))
        .setLabel(truncateLabel(choice))
        .setStyle(ButtonStyle.Primary),
    );
  });

  return [row];
};
