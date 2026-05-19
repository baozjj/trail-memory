import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../lib/jwt.js'
import { unauthorizedError } from '../types/app-error.js'

/** 校验 Authorization Bearer Token，并将 userId 注入 req */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(unauthorizedError())
    return
  }

  const token = header.slice(7).trim()
  if (!token) {
    next(unauthorizedError())
    return
  }

  try {
    const payload = verifyAccessToken(token)
    req.authUser = { userId: payload.userId, email: payload.email }
    next()
  } catch (err) {
    next(err)
  }
}
