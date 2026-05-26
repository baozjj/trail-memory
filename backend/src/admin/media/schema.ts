import { z } from "zod";
import { paginationQuerySchema } from "../shared/pagination.js";

/** 媒体列表查询 */
export const listMediaQuerySchema = paginationQuerySchema.extend({
  q: z.string().optional(),
  referenced: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export type ListMediaQuery = z.infer<typeof listMediaQuerySchema>;

/** 安全文件名（禁止路径穿越） */
export const mediaFilenameParamSchema = z
  .string()
  .min(1)
  .refine((name) => !name.includes("..") && !name.includes("/") && !name.includes("\\"), {
    message: "文件名无效",
  });
