import { ParsedRoleplayResponse } from "../types";
import { looksLikeRoleplayJson } from "./looksLikeRoleplayJson";
import { parseQuestionsFromStory } from "./parseQuestionsFromStory";
import { tryParseJson } from "./tryParseJson";

export const parseModelResponse = (raw: string): ParsedRoleplayResponse | null => {
  const fromJson = tryParseJson(raw);
  if (fromJson) return fromJson;
  if (looksLikeRoleplayJson(raw)) return null;

  return parseQuestionsFromStory(raw);
};
