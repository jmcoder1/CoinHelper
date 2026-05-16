-- OP_GUILD (1271527781716725973)
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'bronze', '1272730232792809472' FROM "Guild" WHERE "discordId" = '1271527781716725973'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'silver', '1272730425357504512' FROM "Guild" WHERE "discordId" = '1271527781716725973'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'gold', '1272730473319108668' FROM "Guild" WHERE "discordId" = '1271527781716725973'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'diamond', '1272730498300379217' FROM "Guild" WHERE "discordId" = '1271527781716725973'
ON CONFLICT ("discordId") DO NOTHING;

-- BMB_GUILD (1215158193634938921)
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'bronze', '1283227873418940488' FROM "Guild" WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'silver', '1283227827553959977' FROM "Guild" WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'gold', '1283227791441264743' FROM "Guild" WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'diamond', '1283227691251794044' FROM "Guild" WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;

-- Tt_GUILD (1323043338903097445)
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'bronze', '1323436068741054475' FROM "Guild" WHERE "discordId" = '1323043338903097445'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'silver', '1323435938109718582' FROM "Guild" WHERE "discordId" = '1323043338903097445'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'gold', '1323435890231742474' FROM "Guild" WHERE "discordId" = '1323043338903097445'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'diamond', '1323435854261125140' FROM "Guild" WHERE "discordId" = '1323043338903097445'
ON CONFLICT ("discordId") DO NOTHING;

-- CUCK_GUILD (1367954490237386882)
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'bronze', '1367954490317344911' FROM "Guild" WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'silver', '1367954490317344912' FROM "Guild" WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'gold', '1367954490317344913' FROM "Guild" WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
INSERT INTO "GuildRole" ("guildId", "name", "discordId")
SELECT "id", 'diamond', '1367954490317344914' FROM "Guild" WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
