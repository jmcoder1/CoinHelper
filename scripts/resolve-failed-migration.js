/**
 * Clear a failed Prisma migration on Railway so deploy can continue.
 *
 * Usage (PowerShell):
 *   $env:DATABASE_URL = "postgresql://...@hayabusa.proxy.rlwy.net:PORT/railway"
 *   node scripts/resolve-failed-migration.js
 */
const { execSync } = require("child_process");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "Set DATABASE_URL to the Railway Postgres PUBLIC url, then re-run.",
  );
  process.exit(1);
}

const host = (databaseUrl.match(/@([^:/?]+)/) || [])[1] || "unknown";
console.log("Using DB host:", host);

const migration = process.argv[2] || "20260917190000_image_coin_payout";

execSync(`npx prisma migrate resolve --rolled-back "${migration}"`, {
  stdio: "inherit",
  env: process.env,
});

console.log(
  `Marked ${migration} as rolled back. Redeploy CoinHelper on Railway.`,
);
