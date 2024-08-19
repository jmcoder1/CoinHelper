import { Awaitable, Client, Events } from "discord.js";
import { Listener } from "./utils/discordUtils/types";

export interface ReadyListener extends Listener {
  event: Events.ClientReady;
  fn: (client: Client) => Awaitable<void>;
}

export const ready: ReadyListener = {
  event: Events.ClientReady,
  fn: async (client: Client) => {
    if (!client.user || !client.application) return;

    console.log(`${client.user.username} is online`);
  },
};
