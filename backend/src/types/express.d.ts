import type { AdminAuthPayload } from '../admin/types.js'
import type { AuthUserPayload } from '../auth/types.js'

declare global {
  namespace Express {
    interface Request {
      /** 鉴权中间件注入的当前用户 */
      authUser?: AuthUserPayload
      /** 管理端鉴权中间件注入的管理员（M01） */
      adminAuth?: AdminAuthPayload
    }
  }
}

export {}
