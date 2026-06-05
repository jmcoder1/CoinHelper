import { PrismaClient } from "@prisma/client";
import { PENDING_START_TTL_MS } from "../constants";

export const extendPendingStartExpiry = async (
  prisma: PrismaClient,
  pendingId: string,
) =>
  prisma.roleplayPendingStart.update({
    where: { id: pendingId },
    data: { expiresAt: new Date(Date.now() + PENDING_START_TTL_MS) },
  });
