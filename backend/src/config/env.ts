/** 读取环境变量，缺失必填项时抛出 */
export function loadEnv(): {
  port: number
  jwtSecret: string
  corsOrigins: string[]
} {
  const port = Number(process.env.PORT ?? 3000)
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('缺少环境变量 JWT_SECRET，请参考 .env.example 配置')
  }

  const rawOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:5173'
  const corsOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return { port, jwtSecret, corsOrigins }
}
