import path from 'node:path'
import multer from 'multer'
import { AppError } from '../types/app-error.js'
import { UPLOAD_DIR } from '../lib/upload-dir.js'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, '').slice(0, 8) || '.jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`
    cb(null, name)
  },
})

/** 图片上传中间件（最多 9 张） */
export const uploadImagesMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 9 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new AppError('仅支持 JPEG、PNG、WebP、GIF 图片', 400, 'INVALID_FILE_TYPE'))
      return
    }
    cb(null, true)
  },
}).array('files', 9)
