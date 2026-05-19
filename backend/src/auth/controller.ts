import type { Request, Response } from 'express'
import { loginBodySchema, registerBodySchema, updateProfileBodySchema } from './schema.js'
import { getUserById, loginUser, registerUser, updateUserProfile } from './service.js'
import { notFoundError } from '../types/app-error.js'

/** 处理用户注册 */
export async function register(req: Request, res: Response): Promise<void> {
  const body = registerBodySchema.parse(req.body)
  const result = await registerUser(body)

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      token: result.token,
      needEmailVerification: result.needEmailVerification,
    },
  })
}

/** 处理用户登录 */
export async function login(req: Request, res: Response): Promise<void> {
  const body = loginBodySchema.parse(req.body)
  const { user, token } = await loginUser(body)

  res.json({
    success: true,
    data: { user, token },
  })
}

/** 获取当前登录用户 */
export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId
  if (!userId) {
    throw notFoundError()
  }

  const user = await getUserById(userId)
  if (!user) {
    throw notFoundError('用户不存在')
  }

  res.json({ success: true, data: { user } })
}

/** 更新当前用户资料 */
export async function updateMe(req: Request, res: Response): Promise<void> {
  const userId = req.authUser?.userId
  if (!userId) {
    throw notFoundError()
  }

  const body = updateProfileBodySchema.parse(req.body)
  const user = await updateUserProfile(userId, body)

  res.json({ success: true, data: { user } })
}
