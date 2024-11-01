import { Client } from "discord.js";
import { ready } from "../ready";
import { messageCreate } from "../messageCreate";
import { interactionCreate } from "../interactionCreate";
import { guildMemberUpdate } from "../guildMemberUpdate";
import { messageReactionAdd } from "../messageReactionAdd";
import { messageReactionRemove } from "../messageReactionRemove";

export const attachListeners = (client: Client) => {
  client.on(ready.event, (client) => ready.fn(client));
  client.on(messageCreate.event, (message) => messageCreate.fn(message));
  client.on(interactionCreate.event, (interaction) =>
    interactionCreate.fn(interaction, client)
  );
  client.on(guildMemberUpdate.event, (oldMember, newMember) =>
    guildMemberUpdate.fn(oldMember, newMember)
  );
  client.on(messageReactionAdd.event, (reaction, user) =>
    messageReactionAdd.fn(reaction, user)
  );
  client.on(messageReactionRemove.event, (reaction, user) =>
    messageReactionRemove.fn(reaction, user)
  );
};
