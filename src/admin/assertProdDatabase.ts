import { getDatabaseHost } from "../utils/string/getDatabaseHost";
import { isAdminDatabaseTunnel } from "./isAdminDatabaseTunnel";

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

  if (LOCAL_HOSTS.has(host) && !isAdminDatabaseTunnel()) {
    throw new Error(
      `Admin refused to start: DATABASE_URL host "${host}" looks like a local database. ` +
        `Use the exposed prod Postgres URL (e.g. your server IP), or set ADMIN_DATABASE_TUNNEL=true if using an SSH tunnel to prod.`,
    );
  }

  if (isInternalDokkuPostgresHost(host)) {
    throw new Error(
      `Admin refused to start: DATABASE_URL host "${host}" is a Dokku-internal hostname. Use the exposed Postgres URL (e.g. your server IP) in .env.production.`,
    );
  }

  return host;
};
