# Trail Memory · 管理后台

与 C 端 `frontend/` 同栈：Vue 3.5 + Vite 8 + Pinia + `tdesign-vue-next`，默认端口 **5174**。

## 前置

1. `backend` 已配置 `ADMIN_JWT_SECRET` 等变量（见 `backend/.env.example`）
2. Node ≥ 18，推荐 pnpm

## 安装

```bash
pnpm install
```

## 开发

仅管理端：

```bash
pnpm dev
```

或在仓库根目录同时启动 API + 管理端（**必须用 npm**，不要用 `pnpm run dev:admin`）：

```bash
npm run dev:admin
```

- 管理端：http://localhost:5174
- API 代理：`/api`、`/uploads` → http://localhost:3000

## 健康检查

```bash
curl http://localhost:3000/api/admin/health
```

## 构建

```bash
pnpm run build
```
