export const buildDuoInviteAcceptedPartnerMessage = (
  initiatorId: string,
): string =>
  `Invite accepted. <@${initiatorId}> will pick their role first — you'll get a DM when it's your turn to pick.`;
