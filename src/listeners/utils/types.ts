import { Awaitable, ClientEvents } from "discord.js";

export interface Listener {
  event: keyof ClientEvents;
  fn: (...args: any[]) => Awaitable<void>;
}
