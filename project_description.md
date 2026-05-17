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

## 设计画板

1. **印记首页** — 瀑布流印记列表、搜索、底部 Tab
2. **Publish Edit** — 发布/编辑印记（图片、标题、描述、位置、开关）
3. **Article Detail** — 印记详情（大图、正文、作者）
4. **Empty State** — 空列表引导（六边形线框 + CTA）

## 开发

```bash
cd frontend && pnpm install && pnpm dev
```

设计稿请在 Cursor 中打开根目录 `pencil-new.pen`（Pencil 扩展）。
