import { MAX_CHOICES } from "../constants";

export const extractQuestionChoices = (paragraph: string): string[] => {
  const questionMatches = paragraph.match(/[^?]+\?/g) ?? [];
  return questionMatches
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(0, MAX_CHOICES);
};
