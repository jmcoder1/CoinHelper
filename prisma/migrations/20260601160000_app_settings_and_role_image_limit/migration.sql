-- AlterTable
ALTER TABLE "GuildRole" ADD COLUMN "imageLimit" INTEGER;

-- Backfill tier role image limits
UPDATE "GuildRole" SET "imageLimit" = 3 WHERE "name" = 'bronze';
UPDATE "GuildRole" SET "imageLimit" = 4 WHERE "name" = 'silver';
UPDATE "GuildRole" SET "imageLimit" = 5 WHERE "name" = 'gold';

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- Seed global app settings
INSERT INTO "AppSetting" ("key", "value") VALUES
  ('new_member_image_limit', '1'),
  ('server_boost_icon_url', 'https://media.sketchfab.com/models/7218d808cf2d46db9fcca7f96aebd76f/thumbnails/40a5430b011647bbafa078d38b0c919e/5fc1f8cf89ea4cfa8bbc77eb1ba2ce31.jpeg');