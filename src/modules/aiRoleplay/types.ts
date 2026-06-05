import { Client } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { UpdateBalanceParams } from "../../utils/apiUtils/unbelievaboatUtils/updateBalance";

export interface RoleplayRole {
  id: string;
  label: string;
  prompt: string;
}

export interface GuildRoleplayConfig {
  guildId: number;
  guildDiscordId: string;
  triggerEmoji: string;
  systemPrompt: string;
  roleplayRoles: RoleplayRole[];
  buttonCost: number;
  authorRewardOnTrigger: number;
  authorRewardOnChoice: number;
  thinkingMode: boolean;
  aiRoleplayChannelId: string;
  economyChannelId: string;
  currencyPluralName: string;
  currencyImage: string;
}

export interface RoleplayEconomyContext {
  guildDiscordId: string;
  economyChannelId: string;
  currencyPluralName: string;
  currencyImage: string;
}

export interface AiRoleplayDeps {
  prisma: PrismaClient;
  updateBalance: (client: Client, params: UpdateBalanceParams) => Promise<void>;
  getUserCashBalance: (guildDiscordId: string, userId: string) => Promise<number>;
}

export interface ParsedRoleplayResponse {
  story: string;
  choices: string[];
}

export interface ExtractRoleplayInputResult {
  caption: string;
  imageUrl: string | null;
}

export interface RoleplayMessageContext {
  sourceAuthorId: string;
  sourceMessageUrl: string;
  sourceCaption?: string;
  imageUrl?: string | null;
  actorUserId: string;
  actorAction: "triggered" | "continued";
  selectedRoleLabel?: string;
  selectedChoice?: string;
}
