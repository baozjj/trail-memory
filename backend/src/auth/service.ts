import bcrypt from 'bcrypt'
import type { User } from '@prisma/client'
import { loadEnv } from '../config/env.js'
import { prisma } from '../lib/prisma.js'
import { signAccessToken } from '../lib/jwt.js'
import { AppError } from '../types/app-error.js'
import type { LoginBody, RegisterBody, UpdateProfileBody } from './schema.js'
import type { PublicUser } from './types.js'

const BCRYPT_ROUNDS = 10
const LOGIN_FAIL_MESSAGE = '邮箱或密码错误'

/** 将数据库用户转为 API 响应结构 */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    signature: user.signature,
    avatarUrl: user.avatarUrl,
    showCardOnGuestPage: user.showCardOnGuestPage,
    isVerified: user.isVerified,
  }
}

/** 从邮箱推导默认昵称 */
function defaultNickname(email: string): string {
  const local = email.split('@')[0] ?? '用户'
  return local.slice(0, 32) || '用户'
}

/** 用户注册：邮箱为唯一标识 */
export async function registerUser(body: RegisterBody): Promise<{
  user: PublicUser
  token?: string
  needEmailVerification: boolean
}> {
  const email = body.email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('该邮箱已被注册', 409, 'EMAIL_EXISTS')
  }

  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS)
  const { emailVerification } = loadEnv()
  const nickname = body.nickname?.trim() || defaultNickname(email)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nickname,
      isVerified: !emailVerification,
    },
  })

  if (emailVerification) {
    // TODO: 调用邮件服务发送验证链接（EMAIL_VERIFICATION=true 时启用）
    return {
      user: toPublicUser(user),
      needEmailVerification: true,
    }
  }

  const token = signAccessToken({ userId: user.id, email: user.email })
  return {
    user: toPublicUser(user),
    token,
    needEmailVerification: false,
  }
}

/** 用户登录：凭证错误时统一模糊提示 */
export async function loginUser(
  body: LoginBody,
): Promise<{ user: PublicUser; token: string }> {
  const email = body.email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError(LOGIN_FAIL_MESSAGE, 401, 'INVALID_CREDENTIALS')
  }

  const matched = await bcrypt.compare(body.password, user.passwordHash)
  if (!matched) {
    throw new AppError(LOGIN_FAIL_MESSAGE, 401, 'INVALID_CREDENTIALS')
  }

  const token = signAccessToken({ userId: user.id, email: user.email })
  return { user: toPublicUser(user), token }
}

/** 按 ID 获取用户公开信息 */
export async function getUserById(userId: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  return toPublicUser(user)
}

/** 更新当前用户资料 */
export async function updateUserProfile(
  userId: string,
  body: UpdateProfileBody,
): Promise<PublicUser> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.signature !== undefined ? { signature: body.signature } : {}),
      ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
      ...(body.showCardOnGuestPage !== undefined
        ? { showCardOnGuestPage: body.showCardOnGuestPage }
        : {}),
    },
  })
  return toPublicUser(user)
}
