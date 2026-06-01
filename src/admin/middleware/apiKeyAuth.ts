import { Request, Response, NextFunction } from "express";
import { getProvidedApiKey } from "../../utils/http/getProvidedApiKey";

export const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    res.status(500).json({ error: "ADMIN_API_KEY is not configured" });
    return;
  }

  const providedKey = getProvidedApiKey(req);
  if (!providedKey || providedKey !== expectedKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
