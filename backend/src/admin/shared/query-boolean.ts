import { z } from "zod";

/** 解析 query 中的布尔值（兼容字符串 "true"/"false" 与 boolean） */
export const queryBooleanSchema = z
  .union([z.enum(["true", "false"]), z.boolean()])
  .optional()
  .transform((v): boolean | undefined => {
    if (v === undefined) return undefined;
    return v === true || v === "true";
  });

/** 解析 query 布尔值，未传时默认 false */
export const queryBooleanDefaultFalseSchema = queryBooleanSchema.transform(
  (v) => v ?? false,
);
