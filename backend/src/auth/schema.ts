import { z } from 'zod'

/** 注册请求体校验 */
export const registerBodySchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位').max(72, '密码过长'),
  nickname: z.string().min(1, '昵称不能为空').max(32, '昵称过长').optional(),
})

/** 登录请求体校验 */
export const loginBodySchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
})

const avatarUrlSchema = z.union([
  z.literal(''),
  z
    .string()
    .max(500)
    .refine((v) => v.startsWith('/uploads/'), { message: '头像地址无效' }),
])

/** 更新个人资料请求体 */
export const updateProfileBodySchema = z
  .object({
    signature: z.string().max(200).optional(),
    avatarUrl: avatarUrlSchema.optional(),
    showCardOnGuestPage: z.boolean().optional(),
  })
  .refine(
    (body) =>
      body.signature !== undefined ||
      body.avatarUrl !== undefined ||
      body.showCardOnGuestPage !== undefined,
    { message: '至少提供一项要更新的资料' },
  )

export type RegisterBody = z.infer<typeof registerBodySchema>
export type LoginBody = z.infer<typeof loginBodySchema>
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>
