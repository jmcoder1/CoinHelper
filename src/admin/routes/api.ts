import { Router } from "express";
import { guildsRouter } from "./guilds";
import { healthRouter } from "./health";
import { metaRouter } from "./meta";
import { settingsRouter } from "./settings";
import { auditRouter } from "./audit";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/meta", metaRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/audit", auditRouter);
apiRouter.use("/guilds", guildsRouter);
