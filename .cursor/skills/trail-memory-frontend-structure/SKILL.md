---
name: trail-memory-frontend-structure
description: >-
  Trail Memory 项目前端目录与模块结构规范。在 frontend/src 下新建或重构 Vue 页面、
  组件、hooks、types 时使用；用户提到「按项目结构」「模块规范」「index.vue 目录」
  或生成 views/components 代码时应用。
---

# Trail Memory · 前端模块结构

## 何时使用

- 新增路由页面、业务组件、子组件
- 重构现有 `.vue` 单文件为文件夹模块
- 从 Pencil/设计稿生成 Vue 代码到本仓库

## 技术栈（固定）

- Vue 3 + TypeScript + Vite + Pinia + Vue Router
- 移动端 UI：**tdesign-mobile-vue** + **tdesign-icons-vue-next**
- Mock：**`src/mock/`**（禁止在组件内写死业务列表）
- 全局领域类型：**`src/types/imprint.ts`**

## 模块目录模板

### 页面 `views/<page-name>/`

```
views/publish/
├── index.vue       # 页面入口，模板 + 样式
├── types.ts        # 页面级类型（若有）
├── const.ts        # 可选：页面常量
└── hooks/
    └── index.ts    # usePublishPage / usePublishDraft 等
```

路由注册：

```ts
component: () => import('@/views/publish/index.vue')
```

### 组件 `components/<domain>/<component-name>/`

```
components/publish/image-row/
├── index.vue
├── types.ts        # XxxProps, XxxEmits
├── const.ts        # 可选：MAX_IMAGE_COUNT 等
└── components/     # 可选：仅内部使用的子组件
    └── xxx/
        ├── index.vue
        └── types.ts
```

### 带工具函数的组件

```
components/imprint/waterfall-grid/
├── index.vue
├── types.ts
├── utils.ts        # splitWaterfallColumns 等纯函数
└── components/imprint-card/
    ├── index.vue
    └── types.ts
```

## 文件职责

| 文件 | 内容 |
|------|------|
| `index.vue` | `<script setup>`、`<template>`、`<style scoped>`；尽量薄，调用 hooks |
| `types.ts` | `defineProps` / `defineEmits` 用到的接口；可 `import type` 自 `@/types/imprint` |
| `const.ts` | 魔法数字、占位文案、路由 name 等常量 |
| `utils.ts` | 无副作用工具函数，便于单测 |
| `hooks/index.ts` | 一个或多个 `useXxx()`；页面专属逻辑放页面 hooks |

## 导入路径

```ts
// 跨模块
import MobilePage from '@/components/layout/mobile-page/index.vue'
import type { ImprintListItem } from '@/types/imprint'
import { mockImprintList } from '@/mock'

// 模块内子组件
import ImprintCard from './components/imprint-card/index.vue'
import { useHomePage } from './hooks'
import { SEARCH_PLACEHOLDER } from './const'
import type { WaterfallGridProps } from './types'
```

## 禁止事项

- ❌ `views/home/HomeView.vue`（PascalCase 单文件页面）
- ❌ `components/foo/Bar.vue`（组件非 `index.vue` 入口）
- ❌ 在 `index.vue` 内写大段 Mock 数组（应使用 `src/mock/`）
- ❌ 页面内重复实现已有 `components/` 模块

## 当前项目映射（参考）

| 路由 | 目录 |
|------|------|
| `/` | `views/home/` |
| `/empty` | `views/empty/` |
| `/publish` | `views/publish/` |
| `/article/:id` | `views/article/` |

共享组件域：`layout`、`imprint`、`publish`、`article`、`empty`。

## 生成新功能流程

1. 确认是**页面**还是**组件**，选择 `views/` 或 `components/<域>/`
2. 创建文件夹（kebab-case）及 `index.vue`、`types.ts`
3. 有状态/副作用 → `hooks/index.ts`；有常量 → `const.ts`；有纯函数 → `utils.ts`
4. 仅父级使用的 UI → 父级 `components/<子名>/`
5. 更新 `router/index.ts`（页面）
6. Mock 追加到 `src/mock/` 并 `export`
7. 运行 `cd frontend && pnpm run type-check`

## 与 Cursor Rule 的关系

日常编辑 `frontend/src/**` 时，`.cursor/rules/frontend-module-structure.mdc` 会自动注入摘要；本 Skill 供完整参考与显式 `@trail-memory-frontend-structure` 调用。
