export const isSessionExpired = (expiresAt: Date): boolean =>
  expiresAt.getTime() <= Date.now();
