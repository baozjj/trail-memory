import { Router } from 'express'
import { asyncHandler } from '../utils/async-handler.js'

/** 管理端 API 路由聚合（M01+ 按模块挂载子路由） */
export const adminRouter = Router()

adminRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: { status: 'ok', scope: 'admin' },
    })
  }),
)
