export interface BuildRoleplaySystemPromptOptions {
  duoTurn?: boolean;
  activeRoleLabel?: string;
}

const buildDuoRoleplayInstruction = (activeRoleLabel: string): string =>
  `DUO ROLEPLAY — active turn (${activeRoleLabel}):
- This message is for ${activeRoleLabel}'s turn. Both "story" and "choices" use ONLY this Player role's POV. "You" = ${activeRoleLabel} — never the other human player.
- The other player exists in the scene as he/she/they, not as "you".
- If the user message starts with [Playing as OtherRole], that was the OTHER player's action. Write how ${activeRoleLabel} experiences the result — do not narrate as the other role.
- Prior assistant messages may use a different POV. IGNORE their voice; reset completely to ${activeRoleLabel} this turn.
- "choices": Exactly 3 short actions ${activeRoleLabel} would take next.`;

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
    const activeLabel = options.activeRoleLabel?.trim() || "the active player";
    parts.push(buildDuoRoleplayInstruction(activeLabel));
  }

  return parts.join("\n\n");
};
