-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildChannel" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "GuildChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildCurrency" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "namePlural" TEXT NOT NULL,
    "iconSrc" TEXT NOT NULL,

    CONSTRAINT "GuildCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildRemovalReason" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "GuildRemovalReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildRole" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "GuildRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_discordId_key" ON "Guild"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildChannel_discordId_key" ON "GuildChannel"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildRole_discordId_key" ON "GuildRole"("discordId");

-- AddForeignKey
ALTER TABLE "GuildChannel" ADD CONSTRAINT "GuildChannel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildCurrency" ADD CONSTRAINT "GuildCurrency_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRemovalReason" ADD CONSTRAINT "GuildRemovalReason_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRole" ADD CONSTRAINT "GuildRole_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
