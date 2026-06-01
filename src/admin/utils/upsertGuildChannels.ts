import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import { isChannelSlotName } from "./isChannelSlotName";

export const upsertGuildChannels = async (
  guildId: number,
  slots: Record<string, string>,
): Promise<void> => {
  for (const [name, discordId] of Object.entries(slots)) {
    if (!isChannelSlotName(name)) {
      throw new Error(`Unknown channel slot: ${name}`);
    }

    const trimmedId = typeof discordId === "string" ? discordId.trim() : "";
    const existing = await prisma.guildChannel.findFirst({
      where: { guildId, name },
    });

    if (!trimmedId) {
      if (existing) {
        await prisma.guildChannel.delete({ where: { id: existing.id } });
      }
      continue;
    }

    if (existing) {
      await prisma.guildChannel.update({
        where: { id: existing.id },
        data: { discordId: trimmedId },
      });
    } else {
      await prisma.guildChannel.create({
        data: { guildId, name, discordId: trimmedId },
      });
    }
  }
};
