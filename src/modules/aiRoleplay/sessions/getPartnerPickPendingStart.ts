import { PrismaClient } from "@prisma/client";
import { PENDING_STATUS_PICK_PARTNER } from "../constants";

export const getPartnerPickPendingStart = async (
  prisma: PrismaClient,
  initiatorId: string,
) =>
  prisma.roleplayPendingStart.findFirst({
    where: {
      initiatorId,
      status: PENDING_STATUS_PICK_PARTNER,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
