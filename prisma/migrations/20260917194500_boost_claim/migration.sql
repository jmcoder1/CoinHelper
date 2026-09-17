-- CreateTable
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
