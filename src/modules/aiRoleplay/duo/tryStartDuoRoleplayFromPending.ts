import { Client, User } from "discord.js";
import { RoleplayPendingStart } from "@prisma/client";
import { executeRoleplayStart } from "../executeRoleplayStart";
import { ROLEPLAY_MODE_DUO } from "../constants";
import { GuildRoleplayConfig } from "../types";
import { AiRoleplayDeps } from "../types";
import { bothDuoRolesPicked } from "../sessions/bothDuoRolesPicked";
import { deleteRoleplayPendingStart } from "../sessions/deleteRoleplayPendingStart";

export const tryStartDuoRoleplayFromPending = async (
  client: Client,
  deps: AiRoleplayDeps,
  config: GuildRoleplayConfig,
  pending: RoleplayPendingStart,
  initiator: User,
): Promise<boolean> => {
  if (!bothDuoRolesPicked(pending)) return false;
  if (
    !pending.partnerId ||
    !pending.initiatorRoleId ||
    !pending.initiatorRoleLabel ||
    !pending.initiatorRolePrompt ||
    !pending.partnerRoleId ||
    !pending.partnerRoleLabel ||
    !pending.partnerRolePrompt
  ) {
    return false;
  }

  const sourceAuthor = await client.users.fetch(pending.sourceAuthorId);

  await deleteRoleplayPendingStart(deps.prisma, pending.id).catch(() => undefined);

  await executeRoleplayStart(client, deps, config, {
    guildId: pending.guildId,
    sourceMessageId: pending.sourceMessageId,
    sourceChannelId: pending.sourceChannelId,
    sourceAuthorId: pending.sourceAuthorId,
    sourceAuthorUsername: sourceAuthor.username,
    sourceAuthorAvatarUrl: sourceAuthor.avatarURL() ?? undefined,
    initiatorId: pending.initiatorId,
    initiator,
    sourceMessageUrl: pending.sourceMessageUrl,
    sourceCaption: pending.sourceCaption,
    sourceImageUrl: pending.sourceImageUrl,
    mode: ROLEPLAY_MODE_DUO,
    partnerId: pending.partnerId,
    selectedRoleId: pending.initiatorRoleId,
    selectedRoleLabel: pending.initiatorRoleLabel,
    selectedRolePrompt: pending.initiatorRolePrompt,
    partnerRoleId: pending.partnerRoleId,
    partnerRoleLabel: pending.partnerRoleLabel,
    partnerRolePrompt: pending.partnerRolePrompt,
  });

  return true;
};
