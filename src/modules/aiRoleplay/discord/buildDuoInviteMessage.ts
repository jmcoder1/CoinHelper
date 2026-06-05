export const buildDuoInviteMessage = (
  initiatorId: string,
  sourceMessageUrl: string,
): string =>
  `<@${initiatorId}> invited you to a duo AI roleplay.\n\n[Original message](${sourceMessageUrl})`;
