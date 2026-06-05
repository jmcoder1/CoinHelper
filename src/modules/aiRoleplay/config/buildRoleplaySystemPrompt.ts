export const buildRoleplaySystemPrompt = (
  basePrompt: string,
  rolePrompt: string,
): string => {
  const trimmedRole = rolePrompt.trim();
  if (!trimmedRole) return basePrompt;

  return `${basePrompt}\n\nPlayer role: ${trimmedRole}`;
};
