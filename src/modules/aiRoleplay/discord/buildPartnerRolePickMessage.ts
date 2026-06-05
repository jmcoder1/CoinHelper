export const buildPartnerRolePickMessage = (
  initiatorId: string,
  initiatorRoleLabel: string,
): string =>
  `<@${initiatorId}> chose **${initiatorRoleLabel}**.\n\nPick your role for this duo roleplay:`;
