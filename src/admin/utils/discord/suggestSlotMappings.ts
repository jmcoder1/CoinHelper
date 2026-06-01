export const normalizeDiscordName = (name: string): string =>
  name.toLowerCase().replace(/^#/, "").replace(/[_\s]+/g, "-");

export const suggestSlotMappings = (
  slotNames: readonly string[],
  discordItems: { id: string; name: string }[],
  existingMappings: { name: string; discordId: string }[],
): Record<string, string> => {
  const mappings: Record<string, string> = {};

  for (const slotName of slotNames) {
    const existing = existingMappings.find((row) => row.name === slotName);
    if (existing?.discordId) {
      mappings[slotName] = existing.discordId;
      continue;
    }

    const match = discordItems.find(
      (item) => normalizeDiscordName(item.name) === slotName,
    );
    mappings[slotName] = match?.id ?? "";
  }

  return mappings;
};

export const getUnmappedSlots = (
  slotNames: readonly string[],
  mappings: Record<string, string>,
): string[] =>
  slotNames.filter((slotName) => !mappings[slotName]?.trim());
