import { Awaitable, Client, Events } from "discord.js";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { Commands } from "../commands/utils/commands";
import { Listener } from "./utils/types";

export interface ReadyListener extends Listener {
  event: Events.ClientReady;
  fn: (client: Client) => Awaitable<void>;
}

export const ready: ReadyListener = {
  event: Events.ClientReady,
  fn: async (client: Client) => {
    if (!client.user || !client.application) return;

    await tryAsyncAwait(() => client.application?.commands.set(Commands));

    console.log(`${client.user.username} is online`);
  },
};
