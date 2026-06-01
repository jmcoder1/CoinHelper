import { Request } from "express";

export const getProvidedApiKey = (req: Request): string | undefined => {
  const headerKey = req.header("X-Admin-Api-Key");
  if (headerKey) return headerKey;

  const queryKey = req.query.apiKey;
  if (typeof queryKey === "string") return queryKey;

  return undefined;
};
