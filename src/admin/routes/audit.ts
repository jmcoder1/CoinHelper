import { Router } from "express";
import { runDiscordGuildAudit } from "../utils/discord/runDiscordGuildAudit";

export const auditRouter = Router();

auditRouter.get("/discord-guilds", async (_req, res) => {
  try {
    const audit = await runDiscordGuildAudit();
    res.json(audit);
  } catch (error) {
    res.status(502).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to run Discord guild audit",
    });
  }
});
