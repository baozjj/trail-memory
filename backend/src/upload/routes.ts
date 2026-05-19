import { Router } from 'express'
import { authMiddleware } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'
import { uploadImagesMiddleware } from './multer.js'
import * as uploadController from './controller.js'

/** 本地上传（后续可替换为 OSS） */
export const uploadRouter = Router()

uploadRouter.post(
  '/',
  authMiddleware,
  (req, res, next) => {
    uploadImagesMiddleware(req, res, (err) => {
      if (err) {
        next(err)
        return
      }
      next()
    })
  },
  asyncHandler(uploadController.uploadImages),
)
