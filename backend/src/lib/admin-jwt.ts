import jwt, { type SignOptions } from "jsonwebtoken";
import type { AdminRole } from "@prisma/client";
import { loadEnv } from "../config/env.js";
import { unauthorizedError } from "../types/app-error.js";

/** 管理端 JWT 载荷 */
export interface AdminJwtPayload {
  adminUserId: string;
  email: string;
  role: AdminRole;
}

/** 签发管理端访问令牌 */
export function signAdminToken(payload: AdminJwtPayload): string {
  const { adminJwtSecret, adminJwtExpiresIn } = loadEnv();
  const options: SignOptions = {
    expiresIn: adminJwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, adminJwtSecret, options);
}

/** 校验并解析管理端访问令牌 */
export function verifyAdminToken(token: string): AdminJwtPayload {
  const { adminJwtSecret } = loadEnv();
  try {
    const decoded = jwt.verify(token, adminJwtSecret);
    if (typeof decoded !== "object" || decoded === null) {
      throw unauthorizedError();
    }
    const { adminUserId, email, role } = decoded as AdminJwtPayload;
    if (!adminUserId || !email || !role) {
      throw unauthorizedError();
    }
    return { adminUserId, email, role };
  } catch {
    throw unauthorizedError();
  }
}
