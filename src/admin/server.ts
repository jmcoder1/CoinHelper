import "./envBootstrap";
import path from "path";
import express from "express";
import { assertProdDatabase } from "./assertProdDatabase";
import { isAdminDatabaseTunnel } from "./isAdminDatabaseTunnel";
import { isAdminReadOnly } from "./isAdminReadOnly";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { readOnlyGuard } from "./middleware/readOnlyGuard";
import { apiRouter } from "./routes/api";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

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

app.use("/api", apiKeyAuth, readOnlyGuard, apiRouter);

const server = app.listen(port, host, () => {
  console.log(`CoinHelper admin running at http://${host}:${port}/app`);
  console.log(`Env loaded from: .env.production`);
  console.log(`Connected to production database: ${databaseHost}`);
  if (isAdminReadOnly()) {
    console.log("READ ONLY mode enabled (ADMIN_READ_ONLY) — writes are disabled");
  }
  if (isAdminDatabaseTunnel()) {
    console.log("Database tunnel mode (ADMIN_DATABASE_TUNNEL) — localhost URL allowed");
  }
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
