import { MIN_CHOICES } from "../constants";
import { ParsedRoleplayResponse } from "../types";
import { normalizeChoices } from "./normalizeChoices";
import { stripJsonCodeFences } from "./stripJsonCodeFences";

export const tryParseJson = (raw: string): ParsedRoleplayResponse | null => {
  const trimmed = stripJsonCodeFences(raw);
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null;

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as {
      story?: unknown;
      choices?: unknown;
    };

    if (typeof parsed.story !== "string" || !Array.isArray(parsed.choices))
      return null;

    const choices = normalizeChoices(
      parsed.choices
        .filter((choice): choice is string => typeof choice === "string")
        .map((choice) => choice.trim())
        .filter(Boolean),
    );

    if (choices.length < MIN_CHOICES) return null;

    return {
      story: parsed.story.trim(),
      choices,
    };
  } catch {
    return null;
  }
};
