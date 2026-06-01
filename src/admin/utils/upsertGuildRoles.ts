import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import { isRoleSlotName } from "./isRoleSlotName";

export const upsertGuildRoles = async (
  guildId: number,
  slots: Record<string, string>,
): Promise<void> => {
  for (const [name, discordId] of Object.entries(slots)) {
    if (!isRoleSlotName(name)) {
      throw new Error(`Unknown role slot: ${name}`);
    }

    const trimmedId = typeof discordId === "string" ? discordId.trim() : "";
    const existing = await prisma.guildRole.findFirst({
      where: { guildId, name },
    });

    if (!trimmedId) {
      if (existing) {
        await prisma.guildRole.delete({ where: { id: existing.id } });
      }
      continue;
    }

    if (existing) {
      await prisma.guildRole.update({
        where: { id: existing.id },
        data: { discordId: trimmedId },
      });
    } else {
      await prisma.guildRole.create({
        data: { guildId, name, discordId: trimmedId },
      });
    }
  }
};
