import { Router } from "express";
import { guildsRouter } from "./guilds";
import { healthRouter } from "./health";
import { metaRouter } from "./meta";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/meta", metaRouter);
apiRouter.use("/guilds", guildsRouter);
