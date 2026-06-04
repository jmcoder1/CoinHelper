import { GuildRoleplayConfig } from "../types";

export const isRoleplayConfigComplete = (
  config: GuildRoleplayConfig | null,
): config is GuildRoleplayConfig => {
  if (!config) return false;
  if (!config.triggerEmoji.trim()) return false;
  if (!config.systemPrompt.trim()) return false;
  if (!config.aiRoleplayChannelId.trim()) return false;
  if (!config.economyChannelId.trim()) return false;
  if (!config.currencyPluralName.trim()) return false;
  if (!Number.isInteger(config.buttonCost) || config.buttonCost < 0) return false;
  if (
    !Number.isInteger(config.authorRewardOnTrigger) ||
    config.authorRewardOnTrigger < 0
  )
    return false;
  if (
    !Number.isInteger(config.authorRewardOnChoice) ||
    config.authorRewardOnChoice < 0
  )
    return false;

  return true;
};
