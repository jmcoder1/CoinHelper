import { Client } from "discord.js";
import { ready } from "../../ready";
import { messageCreate } from "../../messageCreate";
import { interactionCreate } from "../../interactionCreate";

export const attachListeners = (client: Client) => {
  client.on(ready.event, (client) => ready.fn(client));
  client.on(messageCreate.event, (message) => messageCreate.fn(message));
  client.on(interactionCreate.event, (interaction) =>
    interactionCreate.fn(interaction, client)
  );
};
