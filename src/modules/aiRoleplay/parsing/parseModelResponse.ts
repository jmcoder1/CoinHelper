import { ParsedRoleplayResponse } from "../types";
import { parseQuestionsFromStory } from "./parseQuestionsFromStory";
import { tryParseJson } from "./tryParseJson";

export const parseModelResponse = (raw: string): ParsedRoleplayResponse | null =>
  tryParseJson(raw) ?? parseQuestionsFromStory(raw);
