export const isAdminReadOnly = (): boolean => {
  const value = process.env.ADMIN_READ_ONLY?.trim().toLowerCase();
  return value === "true" || value === "1";
};
