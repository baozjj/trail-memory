import type { Request, Response } from "express";
import {
  createAdminBodySchema,
  resetAdminPasswordBodySchema,
  updateAdminBodySchema,
} from "./schema.js";
import {
  createAdmin,
  listAdmins,
  resetAdminPassword,
  updateAdmin,
} from "./service.js";
import { paginationQuerySchema } from "../shared/pagination.js";

/** 管理员列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = paginationQuerySchema.parse(req.query);
  const data = await listAdmins(query);
  res.json({ success: true, data });
}

/** 创建管理员 */
export async function create(req: Request, res: Response): Promise<void> {
  const body = createAdminBodySchema.parse(req.body);
  const admin = await createAdmin(body);
  res.status(201).json({ success: true, data: { admin } });
}

/** 更新管理员 */
export async function update(req: Request, res: Response): Promise<void> {
  const body = updateAdminBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const id = String(req.params.id);
  const admin = await updateAdmin(id, body, adminUserId);
  res.json({ success: true, data: { admin } });
}

/** 重置密码 */
export async function resetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const body = resetAdminPasswordBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const ip =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
      : req.socket.remoteAddress;

  const id = String(req.params.id);
  await resetAdminPassword(id, body, { adminUserId, ip });
  res.json({ success: true, data: { ok: true } });
}
