-- Rename existing ai-gen-image-tips channels to ai-image for OP and TT guilds
UPDATE "GuildChannel"
SET "name" = 'ai-image'
WHERE "discordId" = '1283114792248147998'
  AND "name" = 'ai-gen-image-tips';

UPDATE "GuildChannel"
SET "name" = 'ai-image'
WHERE "discordId" = '1323760824572968970'
  AND "name" = 'ai-gen-image-tips';

-- Add new ai-image channel for BMB guild
INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'ai-image', '1295968174839435306'
FROM "Guild"
WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;

-- Add new ai-image channel for CUCK guild
INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'ai-image', '1367954493144301583'
FROM "Guild"
WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
