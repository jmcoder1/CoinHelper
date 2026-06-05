import { Client, User } from "discord.js";
import { buildRoleplaySystemPrompt } from "./config/buildRoleplaySystemPrompt";
import { GuildRoleplayConfig, RoleplaySessionMode } from "./types";
import { ROLEPLAY_MODE_DUO } from "./constants";
import { buildGenerationFailedMessage } from "./discord/buildGenerationFailedMessage";
import { buildGuildEconomyContext } from "./discord/buildGuildEconomyContext";
import { buildNotConfiguredMessage } from "./discord/buildNotConfiguredMessage";
import { buildRoleplayStoryPayload } from "./discord/buildRoleplayStoryPayload";
import { buildRoleplayThreadStarter } from "./discord/buildRoleplayThreadStarter";
import { createRoleplayThread } from "./discord/createRoleplayThread";
import { notifyReactor } from "./discord/notifyReactor";
import { rewardUser } from "./economy/rewardUser";
import { generateRoleplayResponse } from "./generateRoleplayResponse";
import { createRoleplaySession } from "./sessions/createRoleplaySession";
import { updateSessionOutput } from "./sessions/updateSessionOutput";
import { AiRoleplayDeps } from "./types";

export interface ExecuteRoleplayStartParams {
  guildId: number;
  sourceMessageId: string;
  sourceChannelId: string;
  sourceAuthorId: string;
  sourceAuthorUsername: string;
  sourceAuthorAvatarUrl: string | undefined;
  initiatorId: string;
  initiator: User;
  sourceMessageUrl: string;
  sourceCaption: string;
  sourceImageUrl: string | null;
  mode?: RoleplaySessionMode;
  partnerId?: string;
  selectedRoleId: string;
  selectedRoleLabel: string;
  selectedRolePrompt: string;
  partnerRoleId?: string;
  partnerRoleLabel?: string;
  partnerRolePrompt?: string;
}

export const executeRoleplayStart = async (
  client: Client,
  deps: AiRoleplayDeps,
  config: GuildRoleplayConfig,
  params: ExecuteRoleplayStartParams,
): Promise<boolean> => {
  const economyContext = buildGuildEconomyContext(config);
  const mode = params.mode ?? "solo";
  const isDuo = mode === ROLEPLAY_MODE_DUO;

  try {
    const session = await createRoleplaySession(deps.prisma, {
      guildId: params.guildId,
      sourceMessageId: params.sourceMessageId,
      sourceChannelId: params.sourceChannelId,
      sourceAuthorId: params.sourceAuthorId,
      initiatorId: params.initiatorId,
      sourceMessageUrl: params.sourceMessageUrl,
      sourceCaption: params.sourceCaption,
      sourceImageUrl: params.sourceImageUrl,
      mode,
      partnerId: params.partnerId,
      selectedRoleId: params.selectedRoleId,
      selectedRoleLabel: params.selectedRoleLabel,
      selectedRolePrompt: params.selectedRolePrompt,
      partnerRoleId: params.partnerRoleId,
      partnerRoleLabel: params.partnerRoleLabel,
      partnerRolePrompt: params.partnerRolePrompt,
    });

    const parsed = await generateRoleplayResponse({
      systemPrompt: buildRoleplaySystemPrompt(
        config.systemPrompt,
        params.selectedRolePrompt,
        {
          duoTurn: isDuo,
          activeRoleLabel: isDuo ? params.selectedRoleLabel : undefined,
        },
      ),
      thinkingMode: config.thinkingMode,
      messages: [{ role: "user", content: params.sourceCaption }],
    });
    if (!parsed) {
      await notifyReactor(params.initiator, buildGenerationFailedMessage());
      return false;
    }

    const outputChannel = await client.channels.fetch(config.aiRoleplayChannelId);
    if (!outputChannel?.isTextBased()) {
      await notifyReactor(params.initiator, buildNotConfiguredMessage());
      return false;
    }

    const messageContext = isDuo
      ? {
          sourceAuthorId: params.sourceAuthorId,
          sourceMessageUrl: params.sourceMessageUrl,
          sourceCaption: params.sourceCaption,
          imageUrl: params.sourceImageUrl,
          actorUserId: params.initiatorId,
          actorAction: "triggered" as const,
          mode: "duo" as const,
          initiatorId: params.initiatorId,
          initiatorRoleLabel: params.selectedRoleLabel,
          partnerId: params.partnerId,
          partnerRoleLabel: params.partnerRoleLabel,
          turnUserId: params.initiatorId,
        }
      : {
          sourceAuthorId: params.sourceAuthorId,
          sourceMessageUrl: params.sourceMessageUrl,
          sourceCaption: params.sourceCaption,
          imageUrl: params.sourceImageUrl,
          actorUserId: params.initiatorId,
          actorAction: "triggered" as const,
          mode: "solo" as const,
          selectedRoleLabel: params.selectedRoleLabel,
        };

    const starterMessage = await outputChannel.send(
      buildRoleplayThreadStarter(messageContext),
    );
    const thread = await createRoleplayThread(starterMessage);

    const storyMessage = await thread.send(
      buildRoleplayStoryPayload(
        parsed,
        messageContext,
        session.id,
        config.buttonCost,
        config.currencyImage,
        { showEndButton: isDuo },
      ),
    );

    await updateSessionOutput(deps.prisma, session.id, {
      starterMessageId: starterMessage.id,
      threadId: thread.id,
      outputMessageId: storyMessage.id,
      outputChannelId: outputChannel.id,
      pendingChoices: parsed.choices,
      assistantStory: parsed.story,
    });

    if (config.authorRewardOnTrigger > 0) {
      await rewardUser(
        client,
        deps.updateBalance,
        params.sourceAuthorId,
        params.sourceAuthorUsername,
        params.sourceAuthorAvatarUrl,
        economyContext,
        config.authorRewardOnTrigger,
        `<@${params.initiatorId}> triggered AI roleplay on your message ${params.sourceMessageUrl}`,
      );
    }

    return true;
  } catch (error) {
    console.error("AI roleplay start failed:", error);
    await notifyReactor(params.initiator, buildGenerationFailedMessage());
    return false;
  }
};
