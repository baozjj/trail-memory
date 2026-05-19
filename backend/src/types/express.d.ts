import type { AuthUserPayload } from '../auth/types.js'

declare global {
  namespace Express {
    interface Request {
      /** 鉴权中间件注入的当前用户 */
      authUser?: AuthUserPayload
    }
  }
}

export {}
