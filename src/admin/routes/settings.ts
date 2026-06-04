import { Router } from "express";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import { isNonEmptyString } from "../../utils/string/isNonEmptyString";
import {
  APP_SETTING_NEW_MEMBER_IMAGE_LIMIT,
  APP_SETTING_SERVER_BOOST_ICON_URL,
} from "../../utils/apiUtils/prismaUtils/tierImageLimits";

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  const settings = await prisma.appSetting.findMany({
    orderBy: { key: "asc" },
  });

  const byKey: Record<string, string> = {};
  settings.forEach((row) => {
    byKey[row.key] = row.value;
  });

  res.json({
    newMemberImageLimit: Number(byKey[APP_SETTING_NEW_MEMBER_IMAGE_LIMIT] ?? 1),
    serverBoostIconUrl: byKey[APP_SETTING_SERVER_BOOST_ICON_URL] ?? "",
  });
});

settingsRouter.patch("/", async (req, res) => {
  const { newMemberImageLimit, serverBoostIconUrl } = req.body as {
    newMemberImageLimit?: number;
    serverBoostIconUrl?: string;
  };

  if (newMemberImageLimit !== undefined) {
    if (!Number.isInteger(newMemberImageLimit) || newMemberImageLimit < 0) {
      res.status(400).json({ error: "newMemberImageLimit must be a non-negative integer" });
      return;
    }

    await prisma.appSetting.upsert({
      where: { key: APP_SETTING_NEW_MEMBER_IMAGE_LIMIT },
      create: {
        key: APP_SETTING_NEW_MEMBER_IMAGE_LIMIT,
        value: String(newMemberImageLimit),
      },
      update: { value: String(newMemberImageLimit) },
    });
  }

  if (serverBoostIconUrl !== undefined) {
    if (!isNonEmptyString(serverBoostIconUrl)) {
      res.status(400).json({ error: "serverBoostIconUrl cannot be empty" });
      return;
    }

    await prisma.appSetting.upsert({
      where: { key: APP_SETTING_SERVER_BOOST_ICON_URL },
      create: {
        key: APP_SETTING_SERVER_BOOST_ICON_URL,
        value: serverBoostIconUrl.trim(),
      },
      update: { value: serverBoostIconUrl.trim() },
    });
  }

  const settings = await prisma.appSetting.findMany();
  const byKey: Record<string, string> = {};
  settings.forEach((row) => {
    byKey[row.key] = row.value;
  });

  res.json({
    newMemberImageLimit: Number(byKey[APP_SETTING_NEW_MEMBER_IMAGE_LIMIT] ?? 1),
    serverBoostIconUrl: byKey[APP_SETTING_SERVER_BOOST_ICON_URL] ?? "",
  });
});
