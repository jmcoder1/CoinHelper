-- CreateTable
CREATE TABLE "StoreItem" (
    "id" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "unbItemId" TEXT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "iconEmoji" TEXT,
    "listed" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreItemRoleAction" (
    "id" TEXT NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "discordRoleId" TEXT NOT NULL,

    CONSTRAINT "StoreItemRoleAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreItemRoleRequirement" (
    "id" TEXT NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "discordRoleId" TEXT NOT NULL,

    CONSTRAINT "StoreItemRoleRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorePurchase" (
    "id" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "pricePaid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreItem_guildId_listed_idx" ON "StoreItem"("guildId", "listed");

-- CreateIndex
CREATE INDEX "StoreItem_guildId_deletedAt_idx" ON "StoreItem"("guildId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_guildId_name_key" ON "StoreItem"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_guildId_unbItemId_key" ON "StoreItem"("guildId", "unbItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItemRoleAction_storeItemId_discordRoleId_key" ON "StoreItemRoleAction"("storeItemId", "discordRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItemRoleRequirement_storeItemId_discordRoleId_key" ON "StoreItemRoleRequirement"("storeItemId", "discordRoleId");

-- CreateIndex
CREATE INDEX "StorePurchase_guildId_userId_idx" ON "StorePurchase"("guildId", "userId");

-- CreateIndex
CREATE INDEX "StorePurchase_storeItemId_idx" ON "StorePurchase"("storeItemId");

-- AddForeignKey
ALTER TABLE "StoreItem" ADD CONSTRAINT "StoreItem_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreItemRoleAction" ADD CONSTRAINT "StoreItemRoleAction_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreItemRoleRequirement" ADD CONSTRAINT "StoreItemRoleRequirement_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorePurchase" ADD CONSTRAINT "StorePurchase_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorePurchase" ADD CONSTRAINT "StorePurchase_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;