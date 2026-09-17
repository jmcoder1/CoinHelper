const fs = require("fs");
const path = require("path");

const writeUtf8 = (relPath, contents) => {
  fs.writeFileSync(path.join(__dirname, "..", relPath), contents, {
    encoding: "utf8",
  });
};

writeUtf8(
  "prisma/migrations/20260917190000_image_coin_payout/migration.sql",
  `-- CreateTable
CREATE TABLE IF NOT EXISTS "ImageCoinPayout" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "cashAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clawedBackAt" TIMESTAMP(3),

    CONSTRAINT "ImageCoinPayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ImageCoinPayout_messageId_key" ON "ImageCoinPayout"("messageId");
CREATE INDEX IF NOT EXISTS "ImageCoinPayout_guildId_idx" ON "ImageCoinPayout"("guildId");

DO $$ BEGIN
  ALTER TABLE "ImageCoinPayout" ADD CONSTRAINT "ImageCoinPayout_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
`
);

writeUtf8(
  "prisma/migrations/20260917194500_boost_claim/migration.sql",
  `-- CreateTable
CREATE TABLE IF NOT EXISTS "BoostClaim" (
    "id" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "premiumSince" TIMESTAMP(3) NOT NULL,
    "cashAmount" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoostClaim_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BoostClaim_guildId_userId_idx" ON "BoostClaim"("guildId", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "BoostClaim_guildId_userId_premiumSince_key" ON "BoostClaim"("guildId", "userId", "premiumSince");

DO $$ BEGIN
  ALTER TABLE "BoostClaim" ADD CONSTRAINT "BoostClaim_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
`
);

for (const f of [
  "prisma/migrations/20260917190000_image_coin_payout/migration.sql",
  "prisma/migrations/20260917194500_boost_claim/migration.sql",
]) {
  const bytes = fs.readFileSync(path.join(__dirname, "..", f)).slice(0, 3);
  console.log(f, bytes[0] === 0xef ? "HAS_BOM" : "ok", bytes);
}
