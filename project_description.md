# Trail Memory（印记）

户外徒步/摄影印记记录类移动端 Web 应用。设计稿来源于 `an_heng/pencil-new.pen`，已迁移并本地化到本仓库。

## 仓库结构

| 路径 | 说明 |
|------|------|
| `pencil-new.pen` | Pencil 设计稿（4 个画板，含 Design Token 变量） |
| `images/` | 设计稿引用的位图资源（Pencil 相对路径） |
| `terrain-hex-model.png` | 六边形地形占位图（空状态线框等） |
| `frontend/` | Vue 3 + Vite + TypeScript 前端工程 |
| `docs/design-system/project-tokens.md` | 设计 Token 文档（与 `.pen` 变量同步） |
| `docs/design/pencil-screens.md` | 画板与路由/页面对照 |

## 技术栈

- **设计**：Pencil（`.pen` + Variables）
- **前端**：Vue 3.5、Vue Router 5、Pinia 3、Vite 8、TypeScript

## 设计画板与路由

| 画板 | 路由 | 说明 |
|------|------|------|
| 印记首页 | `/` | 瀑布流、搜索、浮动 Tab |
| Empty State | `/empty` | 空列表引导 |
| Publish Edit | `/publish` | 发布/编辑印记 |
| Article Detail | `/article/:id` | 印记详情 |

## 前端结构

每个页面 / 组件目录包含 `index.vue`，以及按需的 `types.ts`、`const.ts`、`utils.ts`、`hooks/index.ts`；内部子组件放在同级 `components/` 下，命名规则相同。

```
frontend/src/
├── mock/                    # 统一 Mock 数据
├── types/imprint.ts         # 全局领域类型
├── stores/
├── views/
│   ├── home/                # 印记首页
│   ├── empty/               # 空状态页
│   ├── publish/             # 封存印记
│   └── article/             # 印记详情
└── components/
    ├── layout/              # mobile-page、floating-tab-bar
    ├── imprint/             # search-header、waterfall-grid/…
    ├── publish/             # image-row
    ├── article/             # hero、author-card
    └── empty/               # imprint-state
```

组件库：`tdesign-mobile-vue`

## 开发

```bash
cd frontend && pnpm install && pnpm dev
```

设计稿请在 Cursor 中打开根目录 `pencil-new.pen`（Pencil 扩展）。
