import { PrismaClient } from "@prisma/client";
import { SESSION_TTL_MS } from "../constants";

export const appendSessionTurn = async (
  prisma: PrismaClient,
  sessionId: string,
  role: "user" | "assistant",
  content: string,
) => {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  return prisma.roleplaySession.update({
    where: { id: sessionId },
    data: {
      expiresAt,
      turns: {
        create: { role, content },
      },
    },
    include: { turns: { orderBy: { id: "asc" } } },
  });
};
