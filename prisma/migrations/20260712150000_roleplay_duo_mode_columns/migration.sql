-- Fresh DBs create Roleplay* tables after 20260601120000_roleplay_duo_mode; add duo-mode columns here.

ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL DEFAULT 'solo';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "selectedRoleLabel" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRoleId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRoleLabel" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRolePrompt" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "currentTurnUserId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active';

ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "mode" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pick_mode';
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRoleId" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRoleLabel" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRolePrompt" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRoleId" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRoleLabel" TEXT;
ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRolePrompt" TEXT;
