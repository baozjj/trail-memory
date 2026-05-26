# Trail Memory（印记）

户外印记记录应用：用户注册登录后封存印记，通过分享链接或 NFC 供他人访问。本仓库包含 **C 端移动 Web**、**管理后台** 与 **统一 API 服务**。

设计稿与资源自 [`an_heng`](../an_heng) 项目的 `pencil-new.pen` 迁移至本仓库，并完成中文化与 Design Token 整理。

---

## 目录

- [功能概览](#功能概览)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [本地服务地址](#本地服务地址)
- [常用命令](#常用命令)
- [环境变量](#环境变量)
- [项目结构](#项目结构)
- [文档](#文档)
- [设计稿与工具](#设计稿与工具)

---

## 功能概览

| 端                     | 说明                                                            |
| ---------------------- | --------------------------------------------------------------- |
| **C 端** (`frontend/`) | 印记首页、发布/编辑、个人中心、分享页 `/m/:slug`                |
| **管理端** (`admin/`)  | 运营后台（用户/印记治理、类型配置、审计等，按模块迭代）         |
| **API** (`backend/`)   | Express + Prisma + SQLite；C 端 `/api/*`，管理端 `/api/admin/*` |

---

## 技术栈

| 层级      | 技术                                            |
| --------- | ----------------------------------------------- |
| C 端 UI   | Vue 3.5、Vite 8、Pinia、**tdesign-mobile-vue**  |
| 管理端 UI | Vue 3.5、Vite 8、Pinia、**tdesign-vue-next**    |
| 后端      | Node.js、Express 5、Prisma、SQLite、JWT         |
| 包管理    | C 端 / 管理端：**pnpm**；后端 / 根脚本：**npm** |

---

## 环境要求

- **Node.js** ≥ 18（推荐 20+）
- **pnpm**（C 端、管理端）
- **npm**（后端、仓库根目录 `concurrently`）

---

## 快速开始

### 1. 克隆与安装

```bash
git clone <repo-url> trail-memory
cd trail-memory

# 根目录：安装并行启动工具 concurrently
npm install

# 后端 + C 端依赖
npm run install:all

# 管理端依赖（需要后台时）
npm run install:admin
```

### 2. 配置后端（首次必做）

```bash
cd backend
cp .env.example .env
# 编辑 .env：至少设置 JWT_SECRET、ADMIN_JWT_SECRET（管理端 API 必填）
npm run prisma:migrate
cd ..
```

`backend/.env.example` 含 C 端与管理端全部变量说明；本地开发可复制示例中的默认值，**生产环境请更换为强随机密钥**。

### 3. 启动开发环境

在**仓库根目录**任选一种方式：

```bash
# C 端 + API（最常用）
npm run dev

# 管理后台 + API（浏览器请打开 http://localhost:5174 ，不是 5173）
npm run dev:admin
```

> **注意**：根目录请用 `npm run dev:admin`，不要用 `pnpm run dev:admin`（pnpm 会误执行 C 端的 `dev`）。管理端目录内仍可用 `cd admin && pnpm dev`。

也可分终端启动：

```bash
npm run dev:backend    # API  http://localhost:3000
npm run dev:frontend   # C 端 http://localhost:5173
cd admin && pnpm dev   # 管理端 http://localhost:5174
```

### 4. 验证

```bash
# API
curl http://localhost:3000/health
curl http://localhost:3000/api/admin/health

# 浏览器
# C 端：     http://localhost:5173
# 管理端：   http://localhost:5174
```

C 端与管理端通过 Vite 将 `/api`、`/uploads` 代理到 `http://localhost:3000`，无需单独配置前端 API 地址。

---

## 本地服务地址

| 服务         | 地址                              | 说明                           |
| ------------ | --------------------------------- | ------------------------------ |
| C 端         | http://localhost:5173             | `frontend/`，`strictPort`      |
| 管理端       | http://localhost:5174             | `admin/`，`strictPort`         |
| API          | http://localhost:3000             | `backend/`，健康检查 `/health` |
| 上传静态资源 | http://localhost:3000/uploads/... | 本地 `backend/uploads/`        |

C 端与管理端可同时运行，端口不冲突。

---

## 常用命令

在**仓库根目录**执行：

| 命令                                                | 说明                         |
| --------------------------------------------------- | ---------------------------- |
| `npm run dev`                                       | 并行启动 backend + frontend  |
| `npm run dev:admin`                                 | 并行启动 backend + admin     |
| `npm run dev:backend`                               | 仅 API                       |
| `npm run dev:frontend`                              | 仅 C 端                      |
| `npm run install:all`                               | 安装 backend + frontend 依赖 |
| `npm run install:admin`                             | 安装 admin 依赖（pnpm）      |
| `npm run process-hex-image -- <输入图> -o <输出图>` | 六边形封面图处理脚本         |

各子工程内：

| 目录        | 开发          | 构建            |
| ----------- | ------------- | --------------- |
| `frontend/` | `pnpm dev`    | `pnpm build`    |
| `admin/`    | `pnpm dev`    | `pnpm build`    |
| `backend/`  | `npm run dev` | `npm run build` |

后端数据库：`cd backend && npm run prisma:migrate` / `npm run prisma:studio`。

---

## 环境变量

后端统一在 `backend/.env` 配置（模板见 `backend/.env.example`）：

| 变量                 | 说明                                     |
| -------------------- | ---------------------------------------- |
| `DATABASE_URL`       | SQLite 路径，默认 `file:./dev.db`        |
| `JWT_SECRET`         | C 端用户 JWT                             |
| `CORS_ORIGINS`       | C 端来源，默认 `http://localhost:5173`   |
| `ADMIN_JWT_SECRET`   | 管理端 JWT（与 `JWT_SECRET` 必须不同）   |
| `ADMIN_CORS_ORIGINS` | 管理端来源，默认 `http://localhost:5174` |

更多字段见 [`backend/README.md`](./backend/README.md) 与 [`backend/.env.example`](./backend/.env.example)。

---

## 项目结构

```
trail-memory/
├── frontend/              # C 端移动 Web（Vue + tdesign-mobile-vue）
├── admin/                 # 管理后台（Vue + tdesign-vue-next）
├── backend/               # API（Express + Prisma）
├── docs/
│   ├── admin/             # 后台需求与模块文档（M00～M08）
│   └── design-system/     # Design Token
├── pencil-new.pen         # Pencil 设计稿
├── images/                # 设计资源
├── package.json           # 根脚本（dev / dev:admin / install:*）
└── project_description.md # 前端与设计结构说明
```

---

## 文档

| 文档                                                                             | 内容                               |
| -------------------------------------------------------------------------------- | ---------------------------------- |
| [`project_description.md`](./project_description.md)                             | 仓库说明、画板与路由、前端目录约定 |
| [`backend/README.md`](./backend/README.md)                                       | API、数据模型、接口列表            |
| [`admin/README.md`](./admin/README.md)                                           | 管理端启动与健康检查               |
| [`docs/admin/README.md`](./docs/admin/README.md)                                 | 后台模块拆分、实施顺序（M00～M08） |
| [`docs/design/pencil-screens.md`](./docs/design/pencil-screens.md)               | 画板与页面对照                     |
| [`docs/design-system/project-tokens.md`](./docs/design-system/project-tokens.md) | Design Token                       |

后台开发建议顺序：先读 `docs/admin/00-项目概述.md`，再按 `docs/admin/M00-平台基建.md` 起逐模块实现。

---

## 设计稿与工具

**Pencil 设计稿**：在 Cursor 中打开根目录 [`pencil-new.pen`](./pencil-new.pen)（需安装 Pencil 扩展）。

**六边形封面处理**（示例）：

```bash
npm run process-hex-image -- ./西湖标毅线.png -o ./西湖标毅线-1.jpg
```

---

## 常见问题

**后端启动报错「缺少 JWT_SECRET / ADMIN_JWT_SECRET」**  
→ 在 `backend/` 执行 `cp .env.example .env` 并填写必填项。

**管理端页面接口失败**  
→ 确认 `npm run dev:backend` 或 `npm run dev:admin` 已启动，且 `ADMIN_CORS_ORIGINS` 包含 `http://localhost:5174`。

**5173 / 5174 端口被占用**（`Port 5174 is already in use`）  
→ 多为上次未退出的 Vite 进程。先结束占用再启动：

```bash
# macOS / Linux：查看并结束 5174
lsof -i :5174
kill $(lsof -t -i :5174)
```

两个前端均启用 `strictPort`，端口未释放时不会自动换端口。

**执行 `dev:admin` 却看到 C 端页面**  
→ 请确认访问 **http://localhost:5174**（管理端），5173 是 C 端。若曾用 `pnpm run dev:admin`，请改用根目录 **`npm run dev:admin`**（已修复脚本，避免 pnpm 误跑 `npm run dev`）。

**仅开发 C 端、不用根目录脚本**  
→ `cd frontend && pnpm install && pnpm dev`，并另开终端 `cd backend && npm run dev`。
