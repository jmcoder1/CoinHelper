import {
  callRoleplayModel,
  CallRoleplayModelParams,
  RoleplayChatMessage,
} from "./api/roleplayClient";
import { PARSE_RETRY_INSTRUCTION } from "./constants";
import { parseModelResponse } from "./parsing/parseModelResponse";
import { ParsedRoleplayResponse } from "./types";

const LOG_RAW_MAX = 2000;

const logParseFailure = (raw: string, attempt: string): void => {
  console.warn(
    `Roleplay parse failed (${attempt}):`,
    raw.slice(0, LOG_RAW_MAX),
  );
};

export const generateRoleplayResponse = async (
  params: CallRoleplayModelParams,
): Promise<ParsedRoleplayResponse | null> => {
  const raw = await callRoleplayModel(params);
  let parsed = parseModelResponse(raw);
  if (parsed) return parsed;

  logParseFailure(raw, "first attempt");

  const retryMessages: RoleplayChatMessage[] = [
    ...params.messages,
    { role: "assistant", content: raw },
    { role: "user", content: PARSE_RETRY_INSTRUCTION },
  ];

  const retryRaw = await callRoleplayModel({
    ...params,
    messages: retryMessages,
  });
  parsed = parseModelResponse(retryRaw);
  if (parsed) return parsed;

  logParseFailure(retryRaw, "retry");
  return null;
};
