import { z } from "zod";
import { paginationQuerySchema } from "../shared/pagination.js";
import { queryBooleanSchema, queryBooleanDefaultFalseSchema } from "../shared/query-boolean.js";

/** 印记列表查询 */
export const listMemoriesQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  userEmail: z.string().trim().optional(),
  isPublic: queryBooleanSchema,
  typeId: z.string().trim().optional(),
  hasDeleted: queryBooleanDefaultFalseSchema,
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
});

/** 强制下架（MVP 仅允许 isPublic: false） */
export const forceUnpublishBodySchema = z.object({
  isPublic: z.literal(false),
});

export type ListMemoriesQuery = z.infer<typeof listMemoriesQuerySchema>;
export type ForceUnpublishBody = z.infer<typeof forceUnpublishBodySchema>;
