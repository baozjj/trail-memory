import type { NextFunction, Request, Response } from "express";
import { roleHasPermission } from "../permissions.js";
import { forbiddenError, unauthorizedError } from "../../types/app-error.js";

/** 要求当前管理员拥有指定权限 */
export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const auth = req.adminAuth;
    if (!auth) {
      next(unauthorizedError());
      return;
    }

    if (!roleHasPermission(auth.role, permission)) {
      next(forbiddenError());
      return;
    }

    next();
  };
}
