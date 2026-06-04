import { PrismaClient } from "@prisma/client";
import {
  AI_ROLEPLAY_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../../../utils/apiUtils/prismaUtils/constants";
import { GuildRoleplayConfig } from "../types";

export const loadGuildRoleplayConfig = async (
  prisma: PrismaClient,
  guildDiscordId: string,
): Promise<GuildRoleplayConfig | null> => {
  const guild = await prisma.guild.findUnique({
    where: { discordId: guildDiscordId },
    include: {
      aiRoleplayConfig: true,
      guildChannels: true,
      guildCurrencies: true,
    },
  });

  if (!guild?.aiRoleplayConfig) return null;

  const aiRoleplayChannel = guild.guildChannels.find(
    (channel) => channel.name === AI_ROLEPLAY_CHANNEL_NAME,
  );
  if (!aiRoleplayChannel) return null;

  const economyChannel = guild.guildChannels.find(
    (channel) => channel.name === ECONOMY_CHANNEL_NAME,
  );
  const currency = guild.guildCurrencies[0];

  return {
    guildId: guild.id,
    guildDiscordId: guild.discordId,
    triggerEmoji: guild.aiRoleplayConfig.triggerEmoji,
    systemPrompt: guild.aiRoleplayConfig.systemPrompt,
    buttonCost: guild.aiRoleplayConfig.buttonCost,
    authorRewardOnTrigger: guild.aiRoleplayConfig.authorRewardOnTrigger,
    authorRewardOnChoice: guild.aiRoleplayConfig.authorRewardOnChoice,
    thinkingMode: guild.aiRoleplayConfig.thinkingMode,
    aiRoleplayChannelId: aiRoleplayChannel.discordId,
    economyChannelId: economyChannel?.discordId ?? "",
    currencyPluralName: currency?.namePlural ?? "",
    currencyImage: currency?.iconSrc ?? "",
  };
};
