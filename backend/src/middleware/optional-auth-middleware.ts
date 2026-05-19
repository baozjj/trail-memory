import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../lib/jwt.js'

/** 可选鉴权：有合法 Token 时注入 authUser，无 Token 或无效时继续放行 */
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next()
    return
  }

  const token = header.slice(7).trim()
  if (!token) {
    next()
    return
  }

  try {
    const payload = verifyAccessToken(token)
    req.authUser = { userId: payload.userId, email: payload.email }
  } catch {
    // 游客访问场景忽略无效 Token
  }

  next()
}
