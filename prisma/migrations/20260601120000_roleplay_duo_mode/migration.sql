-- Duo-mode columns for DBs where Roleplay* tables already existed (incremental dev).
-- On fresh installs those tables are created later; see 20260712150000_roleplay_duo_mode_columns.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'RoleplayPendingStart'
  ) THEN
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "mode" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pick_mode';
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRoleId" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRoleLabel" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "initiatorRolePrompt" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRoleId" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRoleLabel" TEXT;
    ALTER TABLE "RoleplayPendingStart" ADD COLUMN IF NOT EXISTS "partnerRolePrompt" TEXT;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'RoleplaySession'
  ) THEN
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL DEFAULT 'solo';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "selectedRoleLabel" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRoleId" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRoleLabel" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "partnerRolePrompt" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "currentTurnUserId" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "RoleplaySession" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active';
  END IF;
END $$;
