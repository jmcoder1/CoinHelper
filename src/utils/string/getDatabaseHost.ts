export const getDatabaseHost = (): string => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in .env.production");
  }

  const match = databaseUrl.match(/@([^:/]+)/);
  return match?.[1] ?? "unknown";
};
