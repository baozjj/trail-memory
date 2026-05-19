/** HTTP 业务错误，供统一错误中间件识别 */
export class AppError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

/** 资源未找到 */
export function notFoundError(message = '资源不存在'): AppError {
  return new AppError(message, 404, 'NOT_FOUND')
}

/** 未授权 */
export function unauthorizedError(message = '未登录或凭证无效'): AppError {
  return new AppError(message, 401, 'UNAUTHORIZED')
}
