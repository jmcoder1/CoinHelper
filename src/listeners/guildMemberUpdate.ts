import {
  Awaitable,
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import { Listener } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { SERVER_BOOST_ICON } from "../utils/apiUtils/discordUtils/constants";

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
        reason: `You have been awarded ${REWARD_AMOUNT} $${guildInfo.currencyPluralName} for boosting the server`,
      });

      const boughtCoinsChannel = (await getChannelById(
        oldMember.client,
        guildInfo.channels.boughtCoinsChannelId
      )) as TextChannel;
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Server Boosted")
        .setImage(SERVER_BOOST_ICON)
        .setAuthor({
          name: oldMember.user.username,
          iconURL: oldMember.user.avatarURL() || undefined,
        });
      boughtCoinsChannel.send({
        embeds: [embed],
      });
    }

    return;
  },
};
