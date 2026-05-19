import type { NextFunction, Request, RequestHandler, Response } from 'express'

/** 包装异步路由，将 Promise 拒绝交给错误中间件 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    void fn(req, res, next).catch(next)
  }
}
