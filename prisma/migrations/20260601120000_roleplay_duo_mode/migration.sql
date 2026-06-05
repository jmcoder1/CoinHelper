-- AlterTable
ALTER TABLE "RoleplayPendingStart" ADD COLUMN "mode" TEXT,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pick_mode',
ADD COLUMN "partnerId" TEXT,
ADD COLUMN "initiatorRoleId" TEXT,
ADD COLUMN "initiatorRoleLabel" TEXT,
ADD COLUMN "initiatorRolePrompt" TEXT,
ADD COLUMN "partnerRoleId" TEXT,
ADD COLUMN "partnerRoleLabel" TEXT,
ADD COLUMN "partnerRolePrompt" TEXT;

-- AlterTable
ALTER TABLE "RoleplaySession" ADD COLUMN "mode" TEXT NOT NULL DEFAULT 'solo',
ADD COLUMN "partnerId" TEXT,
ADD COLUMN "selectedRoleLabel" TEXT NOT NULL DEFAULT '',
ADD COLUMN "partnerRoleId" TEXT NOT NULL DEFAULT '',
ADD COLUMN "partnerRoleLabel" TEXT NOT NULL DEFAULT '',
ADD COLUMN "partnerRolePrompt" TEXT NOT NULL DEFAULT '',
ADD COLUMN "currentTurnUserId" TEXT NOT NULL DEFAULT '',
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';