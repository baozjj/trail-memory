import { Router } from 'express'
import * as memoryController from './controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'
import { optionalAuthMiddleware } from '../middleware/optional-auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

/** 印记相关路由 */
export const memoryRouter = Router()

memoryRouter.get('/', authMiddleware, asyncHandler(memoryController.list))
memoryRouter.post('/', authMiddleware, asyncHandler(memoryController.create))
memoryRouter.get('/share/:slug', asyncHandler(memoryController.getShareView))
memoryRouter.get(
  '/view/:id',
  optionalAuthMiddleware,
  asyncHandler(memoryController.getArticleView),
)
memoryRouter.get('/:id', authMiddleware, asyncHandler(memoryController.getById))
memoryRouter.put('/:id', authMiddleware, asyncHandler(memoryController.update))
memoryRouter.patch('/:id', authMiddleware, asyncHandler(memoryController.patch))
memoryRouter.delete('/:id', authMiddleware, asyncHandler(memoryController.remove))
