import { getDatabaseHost } from "../utils/string/getDatabaseHost";

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "host.docker.internal",
]);

const isInternalDokkuPostgresHost = (host: string): boolean =>
  host.startsWith("dokku-postgres-");

export const assertProdDatabase = (): string => {
  const host = getDatabaseHost();

  if (LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Admin refused to start: DATABASE_URL host "${host}" looks like a local database. Use .env.production with the exposed prod Postgres URL.`,
    );
  }

  if (isInternalDokkuPostgresHost(host)) {
    throw new Error(
      `Admin refused to start: DATABASE_URL host "${host}" is a Dokku-internal hostname. Use the exposed Postgres URL (e.g. your server IP) in .env.production.`,
    );
  }

  return host;
};
