# Trail Memory（印记）

户外印记记录应用。设计稿与资源自 [`an_heng`](../an_heng) 项目的 `pencil-new.pen` 迁移至本仓库，并在本仓库内完成中文化与 Design Token 整理。

## 快速开始

**首次**：按下方「后端」完成 `backend` 的环境变量与数据库迁移；在 `frontend`、`backend` 各安装依赖（或使用根目录 `npm run install:all`）。

**日常开发**（仓库根目录一条命令同时启动前后端）：

```bash
npm install          # 根目录，安装 concurrently（仅首次）
npm run dev          # 前端 http://localhost:5173 ，API 经 Vite 代理到后端
```

也可分别启动：`npm run dev:frontend` / `npm run dev:backend`。

前端单独开发时仍可在 `frontend` 下使用 `pnpm install` / `pnpm dev`。

## 设计稿

在 Cursor 中打开根目录 [`pencil-new.pen`](./pencil-new.pen)（需安装 Pencil 扩展）。

- 画板说明：[`docs/design/pencil-screens.md`](./docs/design/pencil-screens.md)
- Design Token：[`docs/design-system/project-tokens.md`](./docs/design-system/project-tokens.md)
- 项目说明：[`project_description.md`](./project_description.md)

## 后端

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

详见 [`backend/README.md`](./backend/README.md)。

## 目录

```
package.json            # 根脚本：npm run dev 并行启动前后端
pencil-new.pen          # Pencil 设计（4 画板 + variables）
images/                 # 设计资源（Pencil 引用）
terrain-hex-model.png
frontend/               # Vue 3 应用
backend/                # Express + Prisma API
docs/                   # 设计文档
```
