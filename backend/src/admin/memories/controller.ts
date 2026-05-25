import type { Request, Response } from "express";
import {
  forceUnpublishBodySchema,
  listMemoriesQuerySchema,
} from "./schema.js";
import {
  forceUnpublishMemory,
  getMemoryDetail,
  listMemories,
  softDeleteMemory,
} from "./service.js";

function clientIp(req: Request): string | undefined {
  return typeof req.headers["x-forwarded-for"] === "string"
    ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
    : req.socket.remoteAddress;
}

/** 印记列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = listMemoriesQuerySchema.parse(req.query);
  const data = await listMemories(query);
  res.json({ success: true, data });
}

/** 印记详情 */
export async function detail(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const memory = await getMemoryDetail(id);
  res.json({ success: true, data: { memory } });
}

/** 强制下架 */
export async function unpublish(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const body = forceUnpublishBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const memory = await forceUnpublishMemory(id, body, {
    adminUserId,
    ip: clientIp(req),
  });
  res.json({ success: true, data: { memory } });
}

/** 软删除 */
export async function remove(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const adminUserId = req.adminAuth!.adminUserId;
  await softDeleteMemory(id, { adminUserId, ip: clientIp(req) });
  res.json({ success: true, data: { ok: true } });
}
