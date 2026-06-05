import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { MAX_CHOICES } from "../constants";
import { buildChoiceButtonLabel } from "./buildChoiceButtonLabel";
import { createChoiceButtonId } from "./createChoiceButtonId";

export const buildChoiceComponents = (
  sessionId: string,
  choices: string[],
  buttonCost: number,
  currencyImage: string,
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  choices.slice(0, MAX_CHOICES).forEach((choice, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(createChoiceButtonId(sessionId, index))
        .setLabel(buildChoiceButtonLabel(choice, buttonCost, currencyImage))
        .setStyle(ButtonStyle.Primary),
    );
  });

  return [row];
};
