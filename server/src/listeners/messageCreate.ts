import { Awaitable, Events, Message } from "discord.js";
import { Listener } from "./utils/discordUtils/types";
import { toBalanceUpdate } from "./utils/unbelievaboatUtils/toBalanceUpdate";
import { OnePieceHentaiZGuild } from "./utils/discordUtils/constants";
import { updateBalance } from "./utils/unbelievaboatUtils/updateBalance";

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
      console.log("message.content", message.content);
      const balanceUpdate = toBalanceUpdate(message.content);
      if (balanceUpdate)
        await updateBalance(message.client, { ...balanceUpdate });
    }
  },
};
