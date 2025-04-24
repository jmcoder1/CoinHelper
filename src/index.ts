import "dotenv-safe/config";
import "reflect-metadata";
import { tryAsyncAwait } from "./utils/tryAsyncAwait";
import { initClient as initDiscordClient } from "./utils/apiUtils/discordUtils/initClient";
import path from "path";
import { createConnection } from "typeorm";
import { entities } from "./utils/apiUtils/postgresUtils/entities";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    logging: true,
    url: process.env.DATABASE_URL,
    entities,
    migrations: [path.join(__dirname, "./entities/migrations/*")],
  });
  await conn.runMigrations();

  await tryAsyncAwait(() => initDiscordClient());
};

main().catch((error) => console.error(error));
