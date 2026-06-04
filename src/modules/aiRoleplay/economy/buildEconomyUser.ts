import { User } from "discord.js";
import { UpdateBalanceParams } from "../../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { RoleplayEconomyContext } from "../types";

export const buildEconomyUser = (
  user: User,
  context: RoleplayEconomyContext,
): UpdateBalanceParams["user"] => ({
  id: user.id,
  name: user.username,
  iconURL: user.avatarURL() ?? undefined,
  guild: {
    id: context.guildDiscordId,
    currencyPluralName: context.currencyPluralName,
    currencyImage: context.currencyImage,
    economyChannelId: context.economyChannelId,
  },
});
