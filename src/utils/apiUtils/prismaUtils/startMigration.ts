import { guilds } from "./constants";
import { prisma } from "./prisma";
import { getDefaultTierImageLimit } from "./tierImageLimits";

export const startMigration = async () => {
  try {
    // Clear existing data
    await prisma.guildRole.deleteMany({});
    await prisma.guildChannel.deleteMany({});
    await prisma.guildCurrency.deleteMany({});
    await prisma.guild.deleteMany({});
    console.log("Existing data dropped successfully.");

    console.log("Inserting initial data...");

    for (const guildData of guilds) {
      // Insert Guild
      const guild = await prisma.guild.create({
        data: {
          discordId: guildData.id,
          name: guildData.name,
        },
      });

      // Insert Channels
      for (const channelData of guildData.channels) {
        await prisma.guildChannel.create({
          data: {
            guildId: guild.id,
            discordId: channelData.discordId,
            name: channelData.name,
          },
        });
      }

      // Insert Roles
      for (const roleData of guildData.roles) {
        await prisma.guildRole.create({
          data: {
            guildId: guild.id,
            discordId: roleData.discordId,
            name: roleData.name,
            imageLimit: getDefaultTierImageLimit(roleData.name) ?? undefined,
          },
        });
      }

      // Insert Currency (if applicable)
      if (guildData.images?.currency) {
        await prisma.guildCurrency.create({
          data: {
            guildId: guild.id,
            name: guildData.currencyName,
            namePlural: guildData.currencyPluralName,
            iconSrc: guildData.images.currency,
          },
        });
      }
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await prisma.$disconnect();
  }
};
