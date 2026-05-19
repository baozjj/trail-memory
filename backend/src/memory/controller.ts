import type { Request, Response } from "express";
import {
  createMemoryBodySchema,
  patchMemoryBodySchema,
  updateMemoryBodySchema,
} from "./schema.js";
import {
  createMemory,
  deleteMemory,
  getMemoryDetail,
  listMemoriesForUser,
  patchMemoryExhibit,
  updateMemory,
} from "./service.js";
import { AppError, unauthorizedError } from "../types/app-error.js";

/** 从路由参数解析印记 ID */
function parseMemoryId(raw: string | string[] | undefined): string {
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id?.trim()) {
    throw new AppError("无效的印记 ID", 400, "BAD_REQUEST");
  }
  return id;
}

/** 获取当前用户的印记列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const items = await listMemoriesForUser(userId, q);

  res.json({ success: true, data: { items } });
}

/** 创建印记 */
export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  const body = createMemoryBodySchema.parse(req.body);
  const item = await createMemory(userId, body);

  res.status(201).json({ success: true, data: { item } });
}

/** 更新印记（发布编辑） */
export async function update(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  const body = updateMemoryBodySchema.parse(req.body);
  const item = await updateMemory(userId, parseMemoryId(req.params.id), body);

  res.json({ success: true, data: { item } });
}

/** 获取单条印记详情 */
export async function getById(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  const item = await getMemoryDetail(userId, parseMemoryId(req.params.id));
  res.json({ success: true, data: { item } });
}

/** 更新展出设置 */
export async function patch(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  const body = patchMemoryBodySchema.parse(req.body);
  const item = await patchMemoryExhibit(
    userId,
    parseMemoryId(req.params.id),
    body,
  );

  res.json({ success: true, data: { item } });
}

/** 删除印记 */
export async function remove(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId;
  if (!userId) {
    throw unauthorizedError();
  }

  await deleteMemory(userId, parseMemoryId(req.params.id));
  res.json({ success: true, data: null });
}
