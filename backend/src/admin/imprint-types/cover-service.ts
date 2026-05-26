import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  ensureImprintTypesDir,
  IMPRINT_COVER_TEMP_DIR,
  IMPRINT_TYPES_DIR,
} from "../../lib/imprint-types-dir.js";
import { getImprintCoverImageInfo, type ImprintCoverImageInfo } from "../../lib/imprint-cover-info.js";
import { processHexImageBuffer } from "../../lib/process-hex-image.js";
import { AppError } from "../../types/app-error.js";

const imprintTypeIdSchema = z
  .string()
  .min(1, "id 不能为空")
  .max(64, "id 过长")
  .regex(/^[a-z0-9-]+$/, "id 仅可包含小写字母、数字和连字符");

export const confirmImprintCoverBodySchema = z.object({
  token: z.string().min(1, "token 不能为空"),
  typeId: imprintTypeIdSchema,
});

export type ConfirmImprintCoverBody = z.infer<typeof confirmImprintCoverBodySchema>;

export interface ProcessedImprintCoverPreview {
  token: string;
  previewBase64: string;
  hexWidth: number;
  hexHeight: number;
  canvasSize: number;
  suggestedCoverPath: string;
}

function processedCoverPath(token: string): string {
  return path.join(IMPRINT_COVER_TEMP_DIR, `${token}.jpg`);
}

async function removeFileIfExists(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing temp files
  }
}

/** 处理上传的六边形原图，返回预览与临时 token */
export async function processImprintCoverUpload(
  inputPath: string,
  typeId?: string,
): Promise<ProcessedImprintCoverPreview> {
  let inputBuffer: Buffer;
  try {
    inputBuffer = await fs.readFile(inputPath);
  } finally {
    await removeFileIfExists(inputPath);
  }

  let processed: Awaited<ReturnType<typeof processHexImageBuffer>>;
  try {
    processed = await processHexImageBuffer(inputBuffer);
  } catch {
    throw new AppError(
      "图片处理失败，请上传白底六边形实体图（PNG/JPEG/WebP）",
      400,
      "IMAGE_PROCESS_FAILED",
    );
  }

  const token = crypto.randomBytes(16).toString("hex");
  await fs.writeFile(processedCoverPath(token), processed.buffer);

  const safeTypeId = typeId?.trim() || "cover";
  const suggestedCoverPath = `/imprint-types/${safeTypeId}.jpg`;

  return {
    token,
    previewBase64: `data:image/jpeg;base64,${processed.buffer.toString("base64")}`,
    hexWidth: processed.hexWidth,
    hexHeight: processed.hexHeight,
    canvasSize: processed.canvasSize,
    suggestedCoverPath,
  };
}

/** 确认并保存处理后的封面到 C 端静态目录 */
export async function confirmImprintCover(
  body: ConfirmImprintCoverBody,
): Promise<{ coverPath: string; coverInfo: ImprintCoverImageInfo }> {
  const tempPath = processedCoverPath(body.token);
  try {
    await fs.access(tempPath);
  } catch {
    throw new AppError("封面预览已过期，请重新上传并处理", 400, "COVER_TOKEN_EXPIRED");
  }

  ensureImprintTypesDir();
  const filename = `${body.typeId}.jpg`;
  const finalPath = path.join(IMPRINT_TYPES_DIR, filename);
  await fs.copyFile(tempPath, finalPath);
  await removeFileIfExists(tempPath);

  const coverPath = `/imprint-types/${filename}`;
  const coverInfo = await getImprintCoverImageInfo(coverPath);
  return { coverPath, coverInfo };
}
