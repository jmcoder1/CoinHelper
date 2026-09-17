import { Client, Events } from "discord.js";
import { ready, registerCommandsForGuild } from "../ready";
import { messageCreate } from "../messageCreate";
import { interactionCreate } from "../interactionCreate";
import { messageReactionAdd } from "../messageReactionAdd";
import { messageReactionRemove } from "../messageReactionRemove";
import { messageDelete } from "../messageDelete";
import { dmMessageCreate } from "../dmMessageCreate";

export const attachListeners = (client: Client) => {
  client.on(ready.event, (client) => ready.fn(client));
  client.on(Events.GuildCreate, (guild) =>
    registerCommandsForGuild(client, guild.id, `${guild.name} (${guild.id})`),
  );
  client.on(messageCreate.event, (message) => messageCreate.fn(message));
  client.on(dmMessageCreate.event, (message) => dmMessageCreate.fn(message));
  client.on(messageDelete.event, (message) => messageDelete.fn(message));
  client.on(interactionCreate.event, (interaction) =>
    interactionCreate.fn(interaction, client)
  );
  client.on(messageReactionAdd.event, (reaction, user) =>
    messageReactionAdd.fn(reaction, user)
  );
  client.on(messageReactionRemove.event, (reaction, user) =>
    messageReactionRemove.fn(reaction, user)
  );
};
