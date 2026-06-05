import { PrismaClient } from "@prisma/client";
import { ROLEPLAY_MODE_SOLO, SESSION_STATUS_ACTIVE, SESSION_TTL_MS } from "../constants";

export interface CreateSessionParams {
  guildId: number;
  sourceMessageId: string;
  sourceChannelId: string;
  sourceAuthorId: string;
  initiatorId: string;
  sourceMessageUrl: string;
  sourceCaption: string;
  sourceImageUrl: string | null;
  mode?: string;
  partnerId?: string | null;
  selectedRoleId: string;
  selectedRoleLabel: string;
  selectedRolePrompt: string;
  partnerRoleId?: string;
  partnerRoleLabel?: string;
  partnerRolePrompt?: string;
}

export const createRoleplaySession = async (
  prisma: PrismaClient,
  params: CreateSessionParams,
) => {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const mode = params.mode ?? ROLEPLAY_MODE_SOLO;

  return prisma.roleplaySession.create({
    data: {
      guildId: params.guildId,
      sourceMessageId: params.sourceMessageId,
      sourceChannelId: params.sourceChannelId,
      sourceAuthorId: params.sourceAuthorId,
      initiatorId: params.initiatorId,
      sourceMessageUrl: params.sourceMessageUrl,
      sourceCaption: params.sourceCaption,
      sourceImageUrl: params.sourceImageUrl,
      mode,
      partnerId: params.partnerId ?? null,
      selectedRoleId: params.selectedRoleId,
      selectedRoleLabel: params.selectedRoleLabel,
      selectedRolePrompt: params.selectedRolePrompt,
      partnerRoleId: params.partnerRoleId ?? "",
      partnerRoleLabel: params.partnerRoleLabel ?? "",
      partnerRolePrompt: params.partnerRolePrompt ?? "",
      currentTurnUserId: params.initiatorId,
      status: SESSION_STATUS_ACTIVE,
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
