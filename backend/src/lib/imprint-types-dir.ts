import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

/** C 端印记类型封面静态目录 frontend/public/imprint-types */
export const IMPRINT_TYPES_DIR = path.resolve(
  backendRoot,
  "../frontend/public/imprint-types",
);

/** 处理封面时的临时目录 */
export const IMPRINT_COVER_TEMP_DIR = path.join(
  backendRoot,
  "uploads/imprint-cover-temp",
);

/** 确保印记类型封面目录存在 */
export function ensureImprintTypesDir(): void {
  fs.mkdirSync(IMPRINT_TYPES_DIR, { recursive: true });
}

/** 确保封面处理临时目录存在 */
export function ensureImprintCoverTempDir(): void {
  fs.mkdirSync(IMPRINT_COVER_TEMP_DIR, { recursive: true });
}
