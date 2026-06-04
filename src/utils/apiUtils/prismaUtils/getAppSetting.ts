import { prisma } from "./prisma";

export const getAppSetting = async (key: string): Promise<string | null> => {
  const setting = await prisma.appSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
};

export const getAppSettingNumber = async (
  key: string,
  fallback: number,
): Promise<number> => {
  const value = await getAppSetting(key);
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
