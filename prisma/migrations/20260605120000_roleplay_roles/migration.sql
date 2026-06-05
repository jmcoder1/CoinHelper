-- AlterTable
ALTER TABLE "GuildAiRoleplayConfig" ADD COLUMN "roleplayRoles" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "RoleplaySession" ADD COLUMN "selectedRoleId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN "selectedRolePrompt" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "RoleplayPendingStart" (
    "id" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "sourceMessageId" TEXT NOT NULL,
    "sourceChannelId" TEXT NOT NULL,
    "sourceAuthorId" TEXT NOT NULL,
    "sourceMessageUrl" TEXT NOT NULL,
    "sourceCaption" TEXT NOT NULL,
    "sourceImageUrl" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleplayPendingStart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoleplayPendingStart" ADD CONSTRAINT "RoleplayPendingStart_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
