import { Client, GatewayIntentBits } from "discord.js";
import { attachListeners } from "../../listeners/utils/discordUtils/attachListeners";
import { tryAsyncAwait } from "../tryAsyncAwait";

export const initClient = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
    ],
  });
  attachListeners(client);

  await tryAsyncAwait(() => client.login(process.env.DISCORD_TOKEN));

  return client;
};
