import { z } from 'zod'

export const linkSuffixSchema = z
  .string()
  .min(1, '后缀不能为空')
  .max(32, '后缀过长')
  .regex(/^[a-zA-Z0-9]+$/, '后缀仅可包含字母和数字')

/** 图片 URL：本地上传路径或 http(s) */
const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('/uploads/') || /^https?:\/\//.test(value),
    { message: '图片地址无效' },
  )

const memoryFieldsSchema = {
  title: z.string().min(1, '标题不能为空').max(60, '标题过长'),
  content: z.string().max(10000).optional().default(''),
  meta: z.string().max(200).optional().default(''),
  images: z.array(imageUrlSchema).min(1, '至少上传一张图片').max(9),
  isPublic: z.boolean(),
  linkSuffix: linkSuffixSchema.optional(),
  heightWeight: z.number().min(0.5).max(2).optional(),
}

/** 创建印记请求体 */
export const createMemoryBodySchema = z.object(memoryFieldsSchema)

/** 更新印记（发布编辑）请求体 */
export const updateMemoryBodySchema = z.object(memoryFieldsSchema)

/** 更新展出设置请求体 */
export const patchMemoryBodySchema = z
  .object({
    isPublic: z.boolean().optional(),
    linkSuffix: linkSuffixSchema.optional(),
  })
  .refine((body) => body.isPublic !== undefined || body.linkSuffix !== undefined, {
    message: '至少提供 isPublic 或 linkSuffix',
  })

export type CreateMemoryBody = z.infer<typeof createMemoryBodySchema>
export type UpdateMemoryBody = z.infer<typeof updateMemoryBodySchema>
export type PatchMemoryBody = z.infer<typeof patchMemoryBodySchema>
