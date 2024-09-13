import { Awaitable, Events, GuildMember, PartialGuildMember } from "discord.js";
import { Listener } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";

export interface GuildMemberUpdateListener extends Listener {
  event: Events.GuildMemberUpdate;
  fn: (
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ) => Awaitable<void>;
}

const REWARD_AMOUNT = 500;

export const guildMemberUpdate: GuildMemberUpdateListener = {
  event: Events.GuildMemberUpdate,
  fn: async (
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ) => {
    // SERVER BOOSTED
    if (oldMember.premiumSince !== newMember.premiumSince) {
      const guildInfo = getGuildInfoById(oldMember.guild.id);
      if (!guildInfo) return;

      await updateBalance(oldMember.client, {
        user: {
          id: oldMember.id,
          name: oldMember.displayName,
          iconURL: oldMember.avatarURL() || undefined,
          guild: {
            id: guildInfo.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
          },
        },
        cashAmount: REWARD_AMOUNT,
        reason: `You have been awarded ${REWARD_AMOUNT} Berries for boosting the server`,
      });
    }

    return;
  },
};
