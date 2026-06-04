import { PrismaClient } from "@prisma/client";
import { SESSION_TTL_MS } from "../constants";

export interface CreateSessionParams {
  guildId: number;
  sourceMessageId: string;
  sourceChannelId: string;
  sourceAuthorId: string;
  initiatorId: string;
  sourceMessageUrl: string;
  sourceCaption: string;
  sourceImageUrl: string | null;
}

export const createRoleplaySession = async (
  prisma: PrismaClient,
  params: CreateSessionParams,
) => {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  return prisma.roleplaySession.create({
    data: {
      ...params,
      expiresAt,
      turns: {
        create: {
          role: "user",
          content: params.sourceCaption,
        },
      },
    },
    include: { turns: { orderBy: { id: "asc" } } },
  });
};
