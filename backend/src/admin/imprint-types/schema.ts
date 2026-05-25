import { z } from "zod";

const imprintTypeIdSchema = z
  .string()
  .min(1, "id 不能为空")
  .max(64, "id 过长")
  .regex(/^[a-z0-9-]+$/, "id 仅可包含小写字母、数字和连字符");

const coverPathSchema = z
  .string()
  .min(1, "封面路径不能为空")
  .max(200, "封面路径过长")
  .refine((v) => v.startsWith("/imprint-types/"), {
    message: "封面路径必须以 /imprint-types/ 开头",
  });

/** 新建印记类型 */
export const createImprintTypeBodySchema = z.object({
  id: imprintTypeIdSchema,
  label: z.string().min(1, "名称不能为空").max(64, "名称过长"),
  coverPath: coverPathSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  enabled: z.boolean().default(true),
});

/** 更新印记类型（不可改 id） */
export const updateImprintTypeBodySchema = z
  .object({
    label: z.string().min(1).max(64).optional(),
    coverPath: coverPathSchema.optional(),
    sortOrder: z.number().int().min(0).max(9999).optional(),
    enabled: z.boolean().optional(),
  })
  .refine(
    (body) =>
      body.label !== undefined ||
      body.coverPath !== undefined ||
      body.sortOrder !== undefined ||
      body.enabled !== undefined,
    { message: "至少提供一项要更新的字段" },
  );

export type CreateImprintTypeBody = z.infer<typeof createImprintTypeBodySchema>;
export type UpdateImprintTypeBody = z.infer<typeof updateImprintTypeBodySchema>;

/** 印记类型列表查询 */
export const listImprintTypesQuerySchema = z.object({
  q: z.string().trim().optional(),
  enabled: z
    .union([z.enum(["true", "false"]), z.boolean()])
    .optional()
    .transform((v): boolean | undefined => {
      if (v === undefined) return undefined;
      return v === true || v === "true";
    }),
});

export type ListImprintTypesQuery = z.infer<typeof listImprintTypesQuerySchema>;
