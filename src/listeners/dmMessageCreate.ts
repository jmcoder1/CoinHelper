import { Awaitable, Events, Message } from "discord.js";
import { tryHandleAiRoleplayDm } from "../modules/aiRoleplay";
import { Listener } from "./utils/types";

export interface DmMessageCreateListener extends Listener {
  event: Events.MessageCreate;
  fn: (message: Message) => Awaitable<void>;
}

export const dmMessageCreate: DmMessageCreateListener = {
  event: Events.MessageCreate,
  fn: async (message: Message) => {
    if (!message.channel.isDMBased()) return;
    await tryHandleAiRoleplayDm(message.client, message);
  },
};
