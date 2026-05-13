INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'commands', '1273675917910081589'
FROM "Guild"
WHERE "discordId" = '1271527781716725973'
ON CONFLICT ("discordId") DO NOTHING;

INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'commands', '1283233956828811388'
FROM "Guild"
WHERE "discordId" = '1215158193634938921'
ON CONFLICT ("discordId") DO NOTHING;

INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'commands', '1323760643580624896'
FROM "Guild"
WHERE "discordId" = '1323043338903097445'
ON CONFLICT ("discordId") DO NOTHING;

INSERT INTO "GuildChannel" ("guildId", "name", "discordId")
SELECT "id", 'commands', '1367954493144301579'
FROM "Guild"
WHERE "discordId" = '1367954490237386882'
ON CONFLICT ("discordId") DO NOTHING;
