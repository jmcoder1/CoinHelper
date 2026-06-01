import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";

/** Deletes one guild and its related rows. Scoped deletes only — never wipes whole tables. */
export const deleteGuildWithRelations = async (guildId: number): Promise<void> => {
  await prisma.guildRole.deleteMany({ where: { guildId } });
  await prisma.guildChannel.deleteMany({ where: { guildId } });
  await prisma.guildCurrency.deleteMany({ where: { guildId } });
  await prisma.guildRemovalReason.deleteMany({ where: { guildId } });
  await prisma.guild.delete({ where: { id: guildId } });
};
