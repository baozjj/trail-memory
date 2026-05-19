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

export type RegisterBody = z.infer<typeof registerBodySchema>
export type LoginBody = z.infer<typeof loginBodySchema>
