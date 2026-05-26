import fs from "node:fs/promises";
import path from "node:path";
import { IMPRINT_TYPES_DIR } from "./imprint-types-dir.js";

/** 管理端展示的印记类型封面文件信息 */
export interface ImprintCoverImageInfo {
  filename: string;
  sizeBytes: number | null;
}

function extractFilename(coverPath: string): string {
  try {
    const pathname = new URL(coverPath, "http://localhost").pathname;
    return path.basename(pathname);
  } catch {
    return path.basename(coverPath);
  }
}

/** 根据 coverPath（如 /imprint-types/foo.png）解析磁盘上的文件大小 */
export async function getImprintCoverImageInfo(
  coverPath: string,
): Promise<ImprintCoverImageInfo> {
  const filename = extractFilename(coverPath);
  if (!coverPath.startsWith("/imprint-types/")) {
    return { filename, sizeBytes: null };
  }
  const relative = coverPath.slice("/imprint-types/".length);
  if (!relative || relative.includes("..")) {
    return { filename, sizeBytes: null };
  }
  const filePath = path.join(IMPRINT_TYPES_DIR, relative);
  try {
    const stat = await fs.stat(filePath);
    return { filename, sizeBytes: stat.isFile() ? stat.size : null };
  } catch {
    return { filename, sizeBytes: null };
  }
}
