import { RoleplaySession } from "@prisma/client";
import { RoleplayMessageContext } from "../types";
import { ROLEPLAY_MODE_DUO } from "../constants";

export interface BuildRoleplayMessageContextParams {
  session: RoleplaySession;
  actorUserId: string;
  actorAction: "triggered" | "continued";
  selectedChoice?: string;
}

export const buildRoleplayMessageContext = (
  params: BuildRoleplayMessageContextParams,
): RoleplayMessageContext => {
  const base: RoleplayMessageContext = {
    sourceAuthorId: params.session.sourceAuthorId,
    sourceMessageUrl: params.session.sourceMessageUrl,
    sourceCaption: params.session.sourceCaption,
    imageUrl: params.session.sourceImageUrl,
    actorUserId: params.actorUserId,
    actorAction: params.actorAction,
    selectedChoice: params.selectedChoice,
  };

  if (params.session.mode === ROLEPLAY_MODE_DUO && params.session.partnerId) {
    return {
      ...base,
      mode: "duo",
      initiatorId: params.session.initiatorId,
      initiatorRoleLabel: params.session.selectedRoleLabel,
      partnerId: params.session.partnerId,
      partnerRoleLabel: params.session.partnerRoleLabel,
      turnUserId: params.session.currentTurnUserId,
    };
  }

  return {
    ...base,
    mode: "solo",
    selectedRoleLabel: params.session.selectedRoleLabel,
  };
};
