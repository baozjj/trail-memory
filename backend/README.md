# Trail Memory Backend

实体印记管理系统后端（Node.js + Express + TypeScript + Prisma + SQLite）。

## 快速开始

```bash
cd backend
cp .env.example .env   # 首次克隆后配置环境变量
npm install
npm run prisma:migrate
npm run dev
```

服务默认监听 `http://localhost:3000`，健康检查：`GET /health`。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式（tsx watch） |
| `npm run build` | 编译 TypeScript → `dist/` |
| `npm start` | 运行编译产物 |
| `npm run prisma:generate` | 生成 Prisma Client |
| `npm run prisma:migrate` | 执行数据库迁移 |
| `npm run prisma:studio` | 打开 Prisma Studio |

## 目录结构

```
backend/
├── prisma/
│   ├── schema.prisma      # User / Memory 模型
│   └── migrations/
├── src/
│   ├── index.ts           # 启动入口
│   ├── app.ts             # Express 应用装配
│   ├── config/env.ts      # 环境变量
│   ├── lib/prisma.ts      # Prisma 单例
│   ├── middleware/        # 错误处理、404
│   └── types/app-error.ts # 业务错误类型
└── .env.example
```

## 数据模型（与前端对齐）

- **User**：`email` + 密码哈希；名片字段 `nickname`、`signature`、`avatarUrl`、`showCardOnGuestPage`
- **Memory**：对应前端 `ImprintListItem` + 详情字段 `content`、`meta`、`images`（JSON 字符串）

## 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册（邮箱唯一） |
| POST | `/api/auth/login` | 登录，返回 JWT |
| GET | `/api/auth/me` | 当前用户（需 Bearer Token） |

环境变量 `EMAIL_VERIFICATION=true` 时注册后 `isVerified` 保持 false，并预留发送验证邮件逻辑（TODO）。

## 后续模块（占位）

- `/api/memories` — 印记 CRUD、展出设置
