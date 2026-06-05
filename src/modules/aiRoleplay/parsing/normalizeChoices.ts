import { CHOICE_MAX_LENGTH, MAX_CHOICES } from "../constants";

export const normalizeChoices = (choices: string[]): string[] =>
  choices
    .slice(0, MAX_CHOICES)
    .map((choice) => choice.slice(0, CHOICE_MAX_LENGTH));
