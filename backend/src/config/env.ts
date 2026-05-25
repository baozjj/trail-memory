/** 读取环境变量，缺失必填项时抛出 */
export function loadEnv(): {
  port: number
  jwtSecret: string
  jwtExpiresIn: string
  corsOrigins: string[]
  adminJwtSecret: string
  adminJwtExpiresIn: string
  adminCorsOrigins: string[]
  emailVerification: boolean
} {
  const port = Number(process.env.PORT ?? 3000)
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('缺少环境变量 JWT_SECRET，请参考 .env.example 配置')
  }

  const adminJwtSecret = process.env.ADMIN_JWT_SECRET
  if (!adminJwtSecret) {
    throw new Error('缺少环境变量 ADMIN_JWT_SECRET，请参考 .env.example 配置')
  }

  const rawOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:5173'
  const corsOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const rawAdminOrigins = process.env.ADMIN_CORS_ORIGINS ?? 'http://localhost:5174'
  const adminCorsOrigins = rawAdminOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d'
  const adminJwtExpiresIn = process.env.ADMIN_JWT_EXPIRES_IN ?? '8h'
  const emailVerification = process.env.EMAIL_VERIFICATION === 'true'

  return {
    port,
    jwtSecret,
    jwtExpiresIn,
    corsOrigins,
    adminJwtSecret,
    adminJwtExpiresIn,
    adminCorsOrigins,
    emailVerification,
  }
}
