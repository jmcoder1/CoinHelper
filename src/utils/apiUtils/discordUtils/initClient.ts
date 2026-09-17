import { Client, GatewayIntentBits, Partials } from "discord.js";
import { attachListeners } from "../../../listeners/utils/attachListeners";
import { registerAiRoleplay } from "../../../modules/aiRoleplay";
import { tryAsyncAwait } from "../../tryAsyncAwait";

export const initClient = async () => {
  registerAiRoleplay();

  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildInvites,
      // No privileged intents: Message Content (REST fetch), Members (claim-boost), Presence.
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
  });
  attachListeners(client);

  await tryAsyncAwait(() => client.login(process.env.DISCORD_TOKEN));

  return client;
};
