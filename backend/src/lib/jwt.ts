import jwt, { type SignOptions } from 'jsonwebtoken'
import { loadEnv } from '../config/env.js'
import type { JwtPayload } from '../auth/types.js'
import { unauthorizedError } from '../types/app-error.js'

/** 签发访问令牌 */
export function signAccessToken(payload: JwtPayload): string {
  const { jwtSecret, jwtExpiresIn } = loadEnv()
  const options: SignOptions = { expiresIn: jwtExpiresIn as SignOptions['expiresIn'] }
  return jwt.sign(payload, jwtSecret, options)
}

/** 校验并解析访问令牌 */
export function verifyAccessToken(token: string): JwtPayload {
  const { jwtSecret } = loadEnv()
  try {
    const decoded = jwt.verify(token, jwtSecret)
    if (typeof decoded !== 'object' || decoded === null) {
      throw unauthorizedError()
    }
    const { userId, email } = decoded as JwtPayload
    if (!userId || !email) {
      throw unauthorizedError()
    }
    return { userId, email }
  } catch {
    throw unauthorizedError()
  }
}
