import { Router } from "express";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import { getDatabaseHost } from "../../utils/string/getDatabaseHost";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  try {
    const guildCount = await prisma.guild.count();
    const guilds = await prisma.guild.findMany({
      select: { id: true, name: true, discordId: true },
      orderBy: { name: "asc" },
    });

    res.json({
      status: "ok",
      environment: "production",
      databaseHost: getDatabaseHost(),
      guildCount,
      guilds,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      databaseHost: getDatabaseHost(),
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
