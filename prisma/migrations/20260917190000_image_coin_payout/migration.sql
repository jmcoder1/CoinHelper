-- CreateTable
CREATE TABLE "ImageCoinPayout" (
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

-- CreateIndex
CREATE UNIQUE INDEX "ImageCoinPayout_messageId_key" ON "ImageCoinPayout"("messageId");

-- CreateIndex
CREATE INDEX "ImageCoinPayout_guildId_idx" ON "ImageCoinPayout"("guildId");

-- AddForeignKey
ALTER TABLE "ImageCoinPayout" ADD CONSTRAINT "ImageCoinPayout_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
