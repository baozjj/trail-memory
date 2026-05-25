import type { Request, Response } from "express";
import {
  confirmImprintCover,
  confirmImprintCoverBodySchema,
  processImprintCoverUpload,
} from "./cover-service.js";
import {
  createImprintTypeBodySchema,
  listImprintTypesQuerySchema,
  updateImprintTypeBodySchema,
} from "./schema.js";
import {
  createImprintType,
  listImprintTypes,
  updateImprintType,
} from "./service.js";

function clientIp(req: Request): string | undefined {
  return typeof req.headers["x-forwarded-for"] === "string"
    ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
    : req.socket.remoteAddress;
}

/** 印记类型列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = listImprintTypesQuerySchema.parse(req.query);
  const items = await listImprintTypes(query);
  res.json({ success: true, data: { items } });
}

/** 新建印记类型 */
export async function create(req: Request, res: Response): Promise<void> {
  const body = createImprintTypeBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const item = await createImprintType(body, {
    adminUserId,
    ip: clientIp(req),
  });
  res.status(201).json({ success: true, data: { item } });
}

/** 更新印记类型 */
export async function patch(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const body = updateImprintTypeBodySchema.parse(req.body);
  const adminUserId = req.adminAuth!.adminUserId;
  const item = await updateImprintType(id, body, {
    adminUserId,
    ip: clientIp(req),
  });
  res.json({ success: true, data: { item } });
}

/** 处理六边形封面原图，返回预览 */
export async function processCover(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FILE", message: "请上传封面原图" },
    });
    return;
  }

  const typeId = typeof req.body?.typeId === "string" ? req.body.typeId : undefined;
  const preview = await processImprintCoverUpload(file.path, typeId);
  res.json({ success: true, data: { preview } });
}

/** 确认封面并写入静态目录 */
export async function confirmCover(req: Request, res: Response): Promise<void> {
  const body = confirmImprintCoverBodySchema.parse(req.body);
  const result = await confirmImprintCover(body);
  res.json({ success: true, data: result });
}
