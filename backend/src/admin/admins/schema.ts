import { z } from "zod";

const adminRoleSchema = z.enum(["SUPER_ADMIN", "OPERATOR", "VIEWER"]);
const adminStatusSchema = z.enum(["ACTIVE", "DISABLED"]);

/** 创建管理员 */
export const createAdminBodySchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少 8 位").max(72, "密码过长"),
  displayName: z.string().min(1, "显示名不能为空").max(64, "显示名过长"),
  role: adminRoleSchema,
});

/** 更新管理员 */
export const updateAdminBodySchema = z
  .object({
    displayName: z.string().min(1).max(64).optional(),
    role: adminRoleSchema.optional(),
    status: adminStatusSchema.optional(),
  })
  .refine(
    (body) =>
      body.displayName !== undefined ||
      body.role !== undefined ||
      body.status !== undefined,
    { message: "至少提供一项要更新的字段" },
  );

/** 重置密码 */
export const resetAdminPasswordBodySchema = z.object({
  password: z.string().min(8, "密码至少 8 位").max(72, "密码过长"),
});

export type CreateAdminBody = z.infer<typeof createAdminBodySchema>;
export type UpdateAdminBody = z.infer<typeof updateAdminBodySchema>;
export type ResetAdminPasswordBody = z.infer<
  typeof resetAdminPasswordBodySchema
>;
