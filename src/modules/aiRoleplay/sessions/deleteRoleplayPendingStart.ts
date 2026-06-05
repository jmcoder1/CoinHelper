import { PrismaClient } from "@prisma/client";

export const deleteRoleplayPendingStart = async (
  prisma: PrismaClient,
  pendingId: string,
) =>
  prisma.roleplayPendingStart.delete({
    where: { id: pendingId },
  });
