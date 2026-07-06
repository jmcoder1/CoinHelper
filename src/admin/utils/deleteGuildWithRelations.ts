import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";

/** Deletes one guild and its related rows. Scoped deletes only — never wipes whole tables. */
export const deleteGuildWithRelations = async (guildId: number): Promise<void> => {
  await prisma.roleplayPendingStart.deleteMany({ where: { guildId } });
  await prisma.roleplaySession.deleteMany({ where: { guildId } });
  await prisma.guildAiRoleplayConfig.deleteMany({ where: { guildId } });
  await prisma.guildRole.deleteMany({ where: { guildId } });
  await prisma.guildChannel.deleteMany({ where: { guildId } });
  await prisma.guildCurrency.deleteMany({ where: { guildId } });
  await prisma.guild.delete({ where: { id: guildId } });
};
