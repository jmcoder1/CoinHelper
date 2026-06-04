-- CreateTable
CREATE TABLE "GuildAiRoleplayConfig" (
    "guildId" INTEGER NOT NULL,
    "triggerEmoji" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "buttonCost" INTEGER NOT NULL,
    "authorRewardOnTrigger" INTEGER NOT NULL,
    "authorRewardOnChoice" INTEGER NOT NULL,
    "thinkingMode" BOOLEAN NOT NULL,

    CONSTRAINT "GuildAiRoleplayConfig_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "RoleplaySession" (
    "id" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "sourceMessageId" TEXT NOT NULL,
    "sourceChannelId" TEXT NOT NULL,
    "sourceAuthorId" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "sourceMessageUrl" TEXT NOT NULL,
    "sourceCaption" TEXT NOT NULL,
    "sourceImageUrl" TEXT,
    "outputMessageId" TEXT,
    "outputChannelId" TEXT,
    "pendingChoices" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleplaySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleplayTurn" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "RoleplayTurn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuildAiRoleplayConfig" ADD CONSTRAINT "GuildAiRoleplayConfig_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleplaySession" ADD CONSTRAINT "RoleplaySession_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleplayTurn" ADD CONSTRAINT "RoleplayTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RoleplaySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
