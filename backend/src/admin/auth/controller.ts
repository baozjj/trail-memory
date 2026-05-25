import type { Request, Response } from "express";
import { adminLoginBodySchema } from "./schema.js";
import { getAdminById, loginAdmin } from "./service.js";
import { notFoundError } from "../../types/app-error.js";

/** 管理端登录 */
export async function login(req: Request, res: Response): Promise<void> {
  const body = adminLoginBodySchema.parse(req.body);
  const { admin, token } = await loginAdmin(body);

  res.json({
    success: true,
    data: { token, admin },
  });
}

/** 当前登录管理员 */
export async function me(req: Request, res: Response): Promise<void> {
  const adminUserId = req.adminAuth?.adminUserId;
  if (!adminUserId) {
    throw notFoundError();
  }

  const admin = await getAdminById(adminUserId);
  if (!admin) {
    throw notFoundError("管理员不存在");
  }

  res.json({ success: true, data: { admin } });
}
