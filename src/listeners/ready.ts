import { Awaitable, Client, Events } from "discord.js";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { Commands } from "../commands/utils/commands";
import { Listener } from "./utils/types";
import { formatApiError } from "../utils/formatApiError";

export interface ReadyListener extends Listener {
  event: Events.ClientReady;
  fn: (client: Client) => Awaitable<void>;
}

const registerGuildCommands = async (client: Client, guildId: string, label: string) => {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const [, err] = await tryAsyncAwait(() => guild.commands.set(Commands));
  if (err) {
    console.error(
      `Failed to register commands for ${label}:`,
      formatApiError(err),
    );
    return;
  }
  console.log(`Registered slash commands for ${label}`);
};

export const ready: ReadyListener = {
  event: Events.ClientReady,
  fn: async (client: Client) => {
    if (!client.user || !client.application) return;

    // Prefer guild commands (instant). Clear globals to avoid duplicate slash entries.
    const [, clearErr] = await tryAsyncAwait(() =>
      client.application!.commands.set([]),
    );
    if (clearErr) {
      console.error(
        "Failed to clear global slash commands:",
        formatApiError(clearErr),
      );
    }

    for (const guild of client.guilds.cache.values()) {
      await registerGuildCommands(
        client,
        guild.id,
        `${guild.name} (${guild.id})`,
      );
    }

    console.log(`${client.user.username} is online`);
  },
};

export const registerCommandsForGuild = registerGuildCommands;
