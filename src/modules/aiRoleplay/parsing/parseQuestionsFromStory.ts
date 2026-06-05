import { MAX_CHOICES } from "../constants";
import { ParsedRoleplayResponse } from "../types";
import { extractQuestionChoices } from "./extractQuestionChoices";
import { normalizeChoices } from "./normalizeChoices";
import { splitParagraphs } from "./splitParagraphs";

export const parseQuestionsFromStory = (
  raw: string,
): ParsedRoleplayResponse | null => {
  const paragraphs = splitParagraphs(raw);

  if (paragraphs.length === 0) return null;

  const lastParagraph = paragraphs[paragraphs.length - 1];
  const storyParagraphs = paragraphs.slice(0, -1);
  const story =
    storyParagraphs.length > 0 ? storyParagraphs.join("\n\n") : paragraphs[0];

  const choices = extractQuestionChoices(lastParagraph);

  if (choices.length === 0) {
    const fallbackChoices = lastParagraph
      .split(/\?\s*/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, MAX_CHOICES)
      .map((part) => (part.endsWith("?") ? part : `${part}?`));

    if (fallbackChoices.length === 0) return null;

    return {
      story: storyParagraphs.length > 0 ? story : paragraphs[0],
      choices: normalizeChoices(fallbackChoices),
    };
  }

  return {
    story,
    choices: normalizeChoices(choices),
  };
};
