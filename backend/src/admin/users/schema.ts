import { z } from "zod";
import { paginationQuerySchema } from "../shared/pagination.js";

const userStatusSchema = z.enum(["ACTIVE", "BANNED"]);

/** 用户列表查询 */
export const listUsersQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  isVerified: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  status: userStatusSchema.optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
});

/** 更新用户 */
export const updateUserBodySchema = z
  .object({
    status: userStatusSchema.optional(),
    isVerified: z.boolean().optional(),
  })
  .refine(
    (body) => body.status !== undefined || body.isVerified !== undefined,
    { message: "至少提供一项要更新的字段" },
  );

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
