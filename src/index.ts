import { loadBotEnv } from "./bot/envBootstrap";

loadBotEnv();

import { tryAsyncAwait } from "./utils/tryAsyncAwait";
import { initClient as initDiscordClient } from "./utils/apiUtils/discordUtils/initClient";
import { initDatabase } from "./utils/apiUtils/prismaUtils/initDatabase";

const main = async () => {
  await initDatabase();

  await tryAsyncAwait(() => initDiscordClient());
};

main().catch((error) => console.error(error));
