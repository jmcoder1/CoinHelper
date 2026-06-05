import { PrismaClient } from "@prisma/client";
import { PENDING_START_TTL_MS } from "../constants";

export interface CreatePendingStartParams {
  guildId: number;
  initiatorId: string;
  sourceMessageId: string;
  sourceChannelId: string;
  sourceAuthorId: string;
  sourceMessageUrl: string;
  sourceCaption: string;
  sourceImageUrl: string | null;
}

export const createRoleplayPendingStart = async (
  prisma: PrismaClient,
  params: CreatePendingStartParams,
) =>
  prisma.roleplayPendingStart.create({
    data: {
      ...params,
      expiresAt: new Date(Date.now() + PENDING_START_TTL_MS),
    },
  });
