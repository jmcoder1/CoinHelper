import { MAX_CHOICES } from "../constants";
import { ParsedRoleplayResponse } from "../types";

export const tryParseJson = (raw: string): ParsedRoleplayResponse | null => {
  const trimmed = raw.trim();
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

    const choices = parsed.choices
      .filter((choice): choice is string => typeof choice === "string")
      .map((choice) => choice.trim())
      .filter(Boolean)
      .slice(0, MAX_CHOICES);

    if (choices.length === 0) return null;

    return {
      story: parsed.story.trim(),
      choices,
    };
  } catch {
    return null;
  }
};
