import { DUO_ROLEPLAY_INSTRUCTION } from "../constants";

export interface BuildRoleplaySystemPromptOptions {
  duoTurn?: boolean;
}

export const buildRoleplaySystemPrompt = (
  basePrompt: string,
  rolePrompt: string,
  options?: BuildRoleplaySystemPromptOptions,
): string => {
  const parts = [basePrompt];
  const trimmedRole = rolePrompt.trim();

  if (trimmedRole) {
    parts.push(`Player role: ${trimmedRole}`);
  }

  if (options?.duoTurn) {
    parts.push(DUO_ROLEPLAY_INSTRUCTION);
  }

  return parts.join("\n\n");
};
