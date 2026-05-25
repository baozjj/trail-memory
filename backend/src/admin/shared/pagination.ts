import { z } from "zod";

/** 分页查询参数校验 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** 计算 skip 与 take */
export function toPrismaPagination(query: PaginationQuery): {
  skip: number;
  take: number;
} {
  const skip = (query.page - 1) * query.pageSize;
  return { skip, take: query.pageSize };
}
