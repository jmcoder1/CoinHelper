import path from "path";
import express from "express";
import { assertProdDatabase } from "./assertProdDatabase";
import { loadAdminEnv } from "./loadAdminEnv";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { apiRouter } from "./routes/api";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

loadAdminEnv();

const databaseHost = assertProdDatabase();

const adminApiKey = process.env.ADMIN_API_KEY;
if (!adminApiKey) {
  throw new Error("ADMIN_API_KEY is required in .env.production");
}

const port = Number(process.env.ADMIN_PORT) || 3001;
const host = "127.0.0.1";
const publicDir = path.join(__dirname, "public");

const app = express();

app.use(express.json());
app.use("/app", express.static(publicDir));

app.get("/", (_req, res) => {
  res.redirect("/app");
});

app.use("/api", apiKeyAuth, apiRouter);

const server = app.listen(port, host, () => {
  console.log(`CoinHelper admin running at http://${host}:${port}/app`);
  console.log(`Connected to production database: ${databaseHost}`);
});

const shutdown = async (): Promise<void> => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
