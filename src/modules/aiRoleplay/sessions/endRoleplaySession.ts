import { PrismaClient } from "@prisma/client";
import { SESSION_STATUS_ENDED } from "../constants";

export const endRoleplaySession = async (
  prisma: PrismaClient,
  sessionId: string,
) =>
  prisma.roleplaySession.update({
    where: { id: sessionId },
    data: { status: SESSION_STATUS_ENDED },
  });
