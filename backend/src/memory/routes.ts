import { Router } from 'express'
import * as memoryController from './controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

/** 印记相关路由（均需登录） */
export const memoryRouter = Router()

memoryRouter.use(authMiddleware)

memoryRouter.get('/', asyncHandler(memoryController.list))
memoryRouter.post('/', asyncHandler(memoryController.create))
memoryRouter.get('/:id', asyncHandler(memoryController.getById))
memoryRouter.put('/:id', asyncHandler(memoryController.update))
memoryRouter.patch('/:id', asyncHandler(memoryController.patch))
memoryRouter.delete('/:id', asyncHandler(memoryController.remove))
