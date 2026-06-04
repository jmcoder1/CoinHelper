import { Router } from "express";
import { getDatabaseHost } from "../../utils/string/getDatabaseHost";
import { isAdminReadOnly } from "../isAdminReadOnly";
import { CHANNEL_SLOT_NAMES, ROLE_SLOT_NAMES } from "../slotNames";
import { TIER_ROLE_NAMES } from "../../utils/apiUtils/prismaUtils/constants";

export const metaRouter = Router();

metaRouter.get("/", (_req, res) => {
  res.json({
    environment: "production",
    databaseHost: getDatabaseHost(),
    readOnly: isAdminReadOnly(),
    configSource: "database",
    channelSlotNames: CHANNEL_SLOT_NAMES,
    roleSlotNames: ROLE_SLOT_NAMES,
    tierRoleSlotNames: TIER_ROLE_NAMES,
  });
});
