-- CreateTable
CREATE TABLE "FeaturedMediaPost" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceChannelId" TEXT NOT NULL,
    "featuredChannelId" TEXT NOT NULL,
    "featuredChannelMessageId" TEXT,
    "cashAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedMediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedMediaPost_messageId_key" ON "FeaturedMediaPost"("messageId");

-- CreateIndex
CREATE INDEX "FeaturedMediaPost_guildId_idx" ON "FeaturedMediaPost"("guildId");

-- AddForeignKey
ALTER TABLE "FeaturedMediaPost" ADD CONSTRAINT "FeaturedMediaPost_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
