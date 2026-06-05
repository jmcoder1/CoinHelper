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
    parts.push(
      `Duo turn: Write this response only from the active player's role above. "You" means that role — not the other player. Generate 3 choices that role would take next.`,
    );
  }

  return parts.join("\n\n");
};
