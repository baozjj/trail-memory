import type { Request, Response } from "express";
import {
  listMediaQuerySchema,
  mediaFilenameParamSchema,
} from "./schema.js";
import { getMediaReferences, getMediaStats, listMedia } from "./service.js";

/** 存储统计 */
export async function stats(_req: Request, res: Response): Promise<void> {
  const data = await getMediaStats();
  res.json({ success: true, data });
}

/** 媒体文件列表 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = listMediaQuerySchema.parse(req.query);
  const data = await listMedia(query);
  res.json({ success: true, data });
}

/** 文件引用详情 */
export async function references(req: Request, res: Response): Promise<void> {
  const filename = mediaFilenameParamSchema.parse(req.params.filename);
  const data = await getMediaReferences(filename);
  res.json({ success: true, data });
}
