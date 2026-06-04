import { GuildRoleplayConfig, RoleplayEconomyContext } from "../types";

export const buildGuildEconomyContext = (
  config: GuildRoleplayConfig,
): RoleplayEconomyContext => ({
  guildDiscordId: config.guildDiscordId,
  economyChannelId: config.economyChannelId,
  currencyPluralName: config.currencyPluralName,
  currencyImage: config.currencyImage,
});
