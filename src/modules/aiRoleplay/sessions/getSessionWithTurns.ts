import { PrismaClient } from "@prisma/client";

export const getSessionWithTurns = async (
  prisma: PrismaClient,
  sessionId: string,
) =>
  prisma.roleplaySession.findUnique({
    where: { id: sessionId },
    include: { turns: { orderBy: { id: "asc" } } },
  });
