import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const defaultUploadDir = path.resolve(backendRoot, '../data/uploads')

/** 上传目录（默认在 backend 外层，可用 UPLOAD_DIR 覆盖） */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? defaultUploadDir)

/** 确保上传目录存在 */
export function ensureUploadDir(): void {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
