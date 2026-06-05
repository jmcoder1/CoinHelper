import { PrismaClient } from "@prisma/client";

export const getRoleplayPendingStart = async (
  prisma: PrismaClient,
  pendingId: string,
) =>
  prisma.roleplayPendingStart.findUnique({
    where: { id: pendingId },
  });
