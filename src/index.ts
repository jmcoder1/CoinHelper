import "dotenv-safe/config";
import "reflect-metadata";
import { tryAsyncAwait } from "./utils/tryAsyncAwait";
import { initClient } from "./utils/apiUtils/initClient";

const main = async () => {
  await tryAsyncAwait(() => initClient());
};

main().catch((error) => console.error(error));
