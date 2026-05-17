# Project Tokens — Trail Memory

与 `pencil-new.pen` 内 `variables` 块保持一致。Pencil 中引用形式：`$color/bg/page`。

## Color

| Token | Value | 用途 |
|-------|-------|------|
| `color/bg/page` | `#FFFFFF` | 页面背景 |
| `color/bg/muted` | `#EFEFEF` | 搜索框、图片占位等弱背景 |
| `color/bg/elevated` | `#F2F2F2` | 作者卡片等抬升区域 |
| `color/text/primary` | `#000000` | 主文案、图标强调 |
| `color/text/secondary` | `#333333` | 次级正文 |
| `color/text/tertiary` | `#888888` | 辅助说明 |
| `color/text/placeholder` | `#A8A8A8` | 输入占位 |
| `color/text/hint` | `#D0D0D0` | 表单提示 |
| `color/text/meta` | `#AAAAAA` | 元信息（日期等） |
| `color/icon/muted` | `#C4C4C4` | 卡片内次要图标 |
| `color/icon/inactive` | `#C8C8C8` | Tab 未选中 |
| `color/border/subtle` | `#F0F0F0` | 分割线 |
| `color/cta/primary` | `#000000` | 主按钮背景 |
| `color/cta/on-primary` | `#FFFFFF` | 主按钮文字 |

## Radius

| Token | Value |
|-------|-------|
| `radius/card` | `8` |
| `radius/chip` | `13` |
| `radius/pill` | `26` |

## Spacing

| Token | Value |
|-------|-------|
| `spacing/page-x` | `16` |
| `spacing/grid-gap` | `12` |
| `spacing/card-gap` | `20` |

## 前端 CSS 变量

见 `frontend/src/styles/tokens.css`，命名：`--tm-color-bg-page` 等。
