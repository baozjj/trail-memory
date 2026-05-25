import type { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../../lib/admin-jwt.js";
import { prisma } from "../../lib/prisma.js";
import { unauthorizedError } from "../../types/app-error.js";

/** 校验管理端 Bearer Token，注入 req.adminAuth */
export async function adminAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(unauthorizedError());
    return;
  }

  const token = header.slice(7).trim();
  if (!token) {
    next(unauthorizedError());
    return;
  }

  try {
    const payload = verifyAdminToken(token);
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminUserId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!admin || admin.status !== "ACTIVE") {
      next(unauthorizedError());
      return;
    }

    req.adminAuth = {
      adminUserId: admin.id,
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}
