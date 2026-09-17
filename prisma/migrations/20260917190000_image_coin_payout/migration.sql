-- CreateTable
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
