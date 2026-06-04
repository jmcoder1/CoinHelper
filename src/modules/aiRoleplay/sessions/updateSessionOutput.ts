import { PrismaClient } from "@prisma/client";
import { SESSION_TTL_MS } from "../constants";

export interface UpdateSessionOutputParams {
  outputMessageId?: string;
  outputChannelId?: string;
  pendingChoices: string[];
  assistantStory: string;
}

export const updateSessionOutput = async (
  prisma: PrismaClient,
  sessionId: string,
  data: UpdateSessionOutputParams,
) => {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const sessionUpdate: {
    pendingChoices: string[];
    expiresAt: Date;
    outputMessageId?: string;
    outputChannelId?: string;
  } = {
    pendingChoices: data.pendingChoices,
    expiresAt,
  };

  if (data.outputMessageId) sessionUpdate.outputMessageId = data.outputMessageId;
  if (data.outputChannelId) sessionUpdate.outputChannelId = data.outputChannelId;

  return prisma.$transaction([
    prisma.roleplayTurn.create({
      data: {
        sessionId,
        role: "assistant",
        content: data.assistantStory,
      },
    }),
    prisma.roleplaySession.update({
      where: { id: sessionId },
      data: sessionUpdate,
    }),
  ]);
};
