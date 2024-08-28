import { Awaitable, Client, Events, Interaction } from "discord.js";
import { handleSlashCommand } from "./utils/handleSlashCommand";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { Listener } from "./utils/types";

export interface InteractionCreateListener extends Listener {
  event: Events.InteractionCreate;
  fn: (interaction: Interaction, client: Client) => Awaitable<void>;
}

export const interactionCreate: InteractionCreateListener = {
  event: Events.InteractionCreate,
  fn: async (interaction: Interaction, client: Client) => {
    if (!interaction.isCommand()) return;

    await tryAsyncAwait(() => handleSlashCommand(client, interaction));
  },
};
