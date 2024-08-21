import { Awaitable, ChannelType, Events, Message } from "discord.js";
import { Listener } from "./utils/discordUtils/types";
import { toBalanceUpdate } from "./utils/unbelievaboatUtils/toBalanceUpdate";
import { OnePieceHentaiZGuild } from "./utils/discordUtils/constants";
import { updateBalance } from "./utils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { getImageMultiplier } from "./utils/discordUtils/getImageMultiplier";

export interface MessageCreateListener extends Listener {
  event: Events.MessageCreate;
  fn: (message: Message) => Awaitable<void>;
}

export const messageCreate: MessageCreateListener = {
  event: Events.MessageCreate,
  fn: async (message: Message) => {
    if (
      [OnePieceHentaiZGuild.channels.invitesChannelId].includes(
        message.channelId
      )
    ) {
      const balanceUpdate = toBalanceUpdate(message.content);
      if (balanceUpdate)
        await updateBalance(message.client, { ...balanceUpdate });
    } else {
      const num = findNumImages(message.attachments);
      if (!num || num === 0) return;

      if (message.channel.type != ChannelType.GuildText) return;

      const imageMultiplier = getImageMultiplier(message.channel.name);
      if (imageMultiplier === 0) return;

      const cashAmount = num * imageMultiplier;
      if (cashAmount === 0) return;

      await updateBalance(message.client, {
        userId: message.author.id,
        cashAmount,
        reason: `${num} image posts in ${message.channel.name}`,
      });
    }
  },
};
