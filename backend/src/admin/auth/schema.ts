import { z } from "zod";

/** 管理端登录请求体 */
export const adminLoginBodySchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "请输入密码"),
});

export type AdminLoginBody = z.infer<typeof adminLoginBodySchema>;
