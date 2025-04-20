import "dotenv-safe/config";
import "reflect-metadata";
import { tryAsyncAwait } from "./utils/tryAsyncAwait";
import { initClient as initDiscordClient } from "./utils/apiUtils/discordUtils/initClient";

const main = async () => {
  await tryAsyncAwait(() => initDiscordClient());
};

main().catch((error) => console.error(error));
