export const isAdminDatabaseTunnel = (): boolean => {
  const value = process.env.ADMIN_DATABASE_TUNNEL?.trim().toLowerCase();
  return value === "true" || value === "1";
};
