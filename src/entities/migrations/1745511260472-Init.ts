import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1745511260472 implements MigrationInterface {
    name = 'Init1745511260472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guild_activity" ("id" SERIAL NOT NULL, "guildId" integer NOT NULL, "numGuildCurrencies" integer NOT NULL DEFAULT '0', "numRemovalReasons" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_4afa6d02e4f4d7bebf5e5a9220e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guild" ("id" SERIAL NOT NULL, "discordId" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cfbbd0a2805cab7053b516068a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guild_channel" ("id" SERIAL NOT NULL, "guildId" integer NOT NULL, "discordId" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_292d9b1dea4a5559df0db94433e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guild_currency" ("id" SERIAL NOT NULL, "guildId" integer NOT NULL, "name" character varying NOT NULL, "namePlural" character varying NOT NULL, "iconSrc" character varying NOT NULL, "bannerSrc" character varying NOT NULL, CONSTRAINT "PK_a85999369e2aa42a15c09b00d9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guild_removal_reason" ("id" SERIAL NOT NULL, "guildId" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_241c08650cfe8579be78bec0761" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guild_role" ("id" SERIAL NOT NULL, "guildId" integer NOT NULL, "discordId" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a1a45af7db4d19d08a238febca1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "guild_role"`);
        await queryRunner.query(`DROP TABLE "guild_removal_reason"`);
        await queryRunner.query(`DROP TABLE "guild_currency"`);
        await queryRunner.query(`DROP TABLE "guild_channel"`);
        await queryRunner.query(`DROP TABLE "guild"`);
        await queryRunner.query(`DROP TABLE "guild_activity"`);
    }

}
