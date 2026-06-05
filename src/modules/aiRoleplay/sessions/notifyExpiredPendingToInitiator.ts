import { User } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { notifyReactor } from "../discord/notifyReactor";

export const notifyExpiredPendingToInitiator = async (
  prisma: PrismaClient,
  initiatorId: string,
  initiator: User,
): Promise<void> => {
  const expired = await prisma.roleplayPendingStart.findFirst({
    where: {
      initiatorId,
      expiresAt: { lte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!expired) return;

  await prisma.roleplayPendingStart
    .delete({ where: { id: expired.id } })
    .catch(() => undefined);

  await notifyReactor(
    initiator,
    "Your previous roleplay setup expired. React again to start over.",
  );
};
