import { NextFunction, Request, Response } from "express";
import { isAdminReadOnly } from "../isAdminReadOnly";

const READ_ONLY_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const readOnlyGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!isAdminReadOnly()) {
    next();
    return;
  }

  if (READ_ONLY_METHODS.has(req.method)) {
    next();
    return;
  }

  res.status(403).json({
    error: "Admin is in read-only mode (ADMIN_READ_ONLY). Writes are disabled.",
  });
};
