import { client as unbelievaboatClient } from "../../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import {
  initAiRoleplayButtonHandler,
  tryHandleAiRoleplayButton,
} from "./handleChoiceButton";
import {
  initAiRoleplayReactionHandler,
  tryHandleAiRoleplayReaction,
} from "./handleReactionTrigger";
import { AiRoleplayDeps } from "./types";

export { AI_ROLEPLAY_CHANNEL_NAME } from "../../utils/apiUtils/prismaUtils/constants";
export { extractRoleplayInput } from "./extraction/extractRoleplayInput";
export { containsAnyOf } from "./parsing/containsAnyOf";
export { containsBannedWord } from "./parsing/containsBannedWord";
export { parseModelResponse } from "./parsing/parseModelResponse";
export { ROLEPLAY_BANNED_WORDS } from "./constants";

const deps: AiRoleplayDeps = {
  prisma,
  updateBalance,
  getUserCashBalance: async (guildDiscordId, userId) =>
    (await unbelievaboatClient.getUserBalance(guildDiscordId, userId)).cash,
};

export const registerAiRoleplay = (): void => {
  initAiRoleplayReactionHandler(deps);
  initAiRoleplayButtonHandler(deps);
};

export { tryHandleAiRoleplayReaction, tryHandleAiRoleplayButton };
