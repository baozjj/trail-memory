import type { Request, Response } from "express";
import { listUsersQuerySchema, updateUserBodySchema } from "./schema.js";
import {
  getUserDetail,
  listUserMemories,
  listUsers,
  updateUser,
} from "./service.js";
import { paginationQuerySchema } from "../shared/pagination.js";

function clientIp(req: Request): string | undefined {
  return typeof req.headers["x-forwarded-for"] === "string"
    ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
    : req.socket.remoteAddress;
}

/** 用户列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = listUsersQuerySchema.parse(req.query);
  const data = await listUsers(query);
  res.json({ success: true, data });
}

/** 用户详情 */
export async function detail(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const user = await getUserDetail(id);
  res.json({ success: true, data: { user } });
}

/** 更新用户 */
export async function patch(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const body = updateUserBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const user = await updateUser(id, body, { adminUserId, ip: clientIp(req) });
  res.json({ success: true, data: { user } });
}

/** 用户印记简表 */
export async function memories(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const query = paginationQuerySchema.parse(req.query);
  const data = await listUserMemories(id, query);
  res.json({ success: true, data });
}
