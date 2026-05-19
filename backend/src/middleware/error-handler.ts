import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { ZodError } from 'zod'
import { AppError } from '../types/app-error.js'

/** 统一错误响应体 */
interface ErrorBody {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/** 将各类错误映射为 HTTP 响应 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ErrorBody = {
      success: false,
      error: { code: err.code, message: err.message },
    }
    res.status(err.statusCode).json(body)
    return
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? '单张图片不能超过 5MB' : '文件上传失败'
    const body: ErrorBody = {
      success: false,
      error: { code: 'UPLOAD_ERROR', message },
    }
    res.status(400).json(body)
    return
  }

  if (err instanceof ZodError) {
    const body: ErrorBody = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '请求参数校验失败',
        details: err.flatten(),
      },
    }
    res.status(400).json(body)
    return
  }

  console.error('[unhandled]', err)
  const body: ErrorBody = {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
  }
  res.status(500).json(body)
}
