import { Router } from 'express'
import * as authController from './controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

/** 认证相关路由 */
export const authRouter = Router()

authRouter.post('/register', asyncHandler(authController.register))
authRouter.post('/login', asyncHandler(authController.login))
authRouter.get('/me', authMiddleware, asyncHandler(authController.me))
authRouter.patch('/me', authMiddleware, asyncHandler(authController.updateMe))
