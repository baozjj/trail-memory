import type { Request, Response } from 'express'
import { AppError, unauthorizedError } from '../types/app-error.js'

/** 处理图片上传，返回可访问路径 */
export async function uploadImages(req: Request, res: Response): Promise<void> {
  if (!req.authUser?.userId) {
    throw unauthorizedError()
  }

  const files = req.files
  if (!Array.isArray(files) || files.length === 0) {
    throw new AppError('请选择至少一张图片', 400, 'NO_FILES')
  }

  const urls = files.map((file) => `/uploads/${file.filename}`)
  res.status(201).json({ success: true, data: { urls } })
}
