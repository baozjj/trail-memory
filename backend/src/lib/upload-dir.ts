import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** 本地上传目录（相对 backend 根目录） */
export const UPLOAD_DIR = path.join(backendRoot, 'uploads')

/** 确保上传目录存在 */
export function ensureUploadDir(): void {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
