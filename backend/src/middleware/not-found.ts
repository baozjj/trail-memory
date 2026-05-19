import type { Request, Response } from 'express'

/** 未匹配路由时返回 404 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: '接口不存在' },
  })
}
