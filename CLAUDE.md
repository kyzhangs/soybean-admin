# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

soybean-admin 是 dtp-runner-dev 测试平台的前端管理界面，基于 Vue 3 + Vite 7 + TypeScript + Naive UI + UnoCSS 构建。使用 pnpm workspace 管理 monorepo，后端对接 FastAPI 服务（端口 9038）。

## Common Commands

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (localhost:9527, test 模式, 代理到 localhost:9038)
pnpm dev

# 启动开发服务器 (prod 模式)
pnpm dev:prod

# 构建
pnpm build          # 生产环境
pnpm build:test     # 测试环境

# Lint (oxlint + eslint，自动修复)
pnpm lint

# 格式化 (oxfmt)
pnpm fmt

# 类型检查
pnpm typecheck

# 生成路由 (elegant-router 文件路由)
pnpm gen-route

# 预览构建产物 (localhost:9725)
pnpm preview
```

## Pre-commit Hooks

提交前自动运行 `typecheck → lint → fmt → git diff --exit-code`，commit message 使用 conventional commits 格式（通过 `sa git-commit-verify` 校验）。

## Architecture

### Monorepo 结构

`packages/` 下包含 `@sa` 作用域的共享库：

- **@sa/axios** - 基于 axios 的 HTTP 客户端封装（含 retry、qs）
- **@sa/alova** - alova 请求库封装（含 mock 支持）
- **@sa/hooks** - Vue 组合式函数
- **@sa/utils** - 通用工具（storage、crypto、color、nanoid）
- **@sa/color** - 颜色工具（colord）
- **@sa/materials** - 材料组件
- **@sa/scripts** - CLI 工具（`sa` 命令，处理版本、changelog、git 提交）
- **@sa/uno-preset** - UnoCSS 自定义预设

### 文件路由 (Elegant Router)

路由通过 `@elegant-router/vue` Vite 插件从 `src/views/` 目录结构自动生成：

- `src/router/elegant/routes.ts` - 自动生成的路由定义（**不要手动编辑**）
- `src/router/elegant/imports.ts` - 自动生成的懒加载导入（**不要手动编辑**）
- `src/router/elegant/transform.ts` - 自动生成的路由转换（**不要手动编辑**）
- `src/typings/elegant-router.d.ts` - 自动生成的路由类型（**不要手动编辑**）

新增页面：在 `src/views/` 下创建目录和 `index.vue`，运行 `pnpm gen-route` 重新生成路由。

路由命名规则：目录路径中 `/` 变为 `_`，如 `system-manage/users` → 路由名 `system-manage_users`。

两种布局：`base`（带侧边栏/头部的主布局）、`blank`（登录/错误页的空白布局）。

### 路由模式

`VITE_AUTH_ROUTE_MODE` 控制路由获取方式：

- `dynamic` - 从后端 API 获取路由（默认）
- `static` - 前端静态定义

### 请求层

`src/service/request/index.ts` 导出两个 axios 实例：

- `request` - 主后端请求（基础 URL 从 `.env.*` 的 `VITE_SERVICE_BASE_URL` 读取）
- `demoRequest` - 演示服务请求

响应格式统一为 `{code, message, data}`，成功码由 `VITE_SERVICE_SUCCESS_CODE`（默认 0）控制。

API 模块位于 `src/service/api/`，按业务分目录：`auth.ts`、`route.ts`、`system-manage/`、`user-center.ts`、`ai/`。

### 状态管理 (Pinia)

Store 模块位于 `src/store/modules/`：

- **app** - 应用状态（语言、设备、侧边栏）
- **theme** - 主题（颜色、布局模式、暗黑模式、水印）
- **auth** - 认证（token、用户信息、权限）
- **route** - 路由状态（路由列表、菜单生成）
- **tab** - 多标签页状态

### 国际化 (i18n)

`src/locales/langs/` 下 `zh-cn.ts` 和 `en-us.ts` 分别为中英文翻译。路由标题通过 meta 中的 `i18nKey`（格式 `route.xxx`）关联翻译。新增页面需同步在两个语言文件中添加对应的 `route.xxx` 条目。

### 主题系统

`src/theme/settings.ts` 定义主题配置（布局模式、颜色、暗黑模式等），`src/theme/preset/` 下有 JSON 预设主题。主题切换通过 `useThemeStore` 管理。

### 组件

- `src/components/common/` - 通用 UI 组件（暗黑模式切换、语言切换、全屏等）
- `src/components/custom/` - 业务组件（SVG 图标、头像、计数器等）
- `src/components/advanced/` - 复杂组件（表格操作栏、列设置、批量操作）
- NaiveUI + ProNaiveUI 组件通过 unplugin 自动注册，无需手动 import

## Environment Variables

所有自定义环境变量使用 `VITE_` 前缀。关键变量：

- `VITE_SERVICE_BASE_URL` - 后端 API 地址（test: `http://localhost:9038/api/v1`）
- `VITE_AUTH_ROUTE_MODE` - 路由模式（`dynamic`/`static`）
- `VITE_HTTP_PROXY` - 是否启用开发代理（`Y`/`N`）
- `VITE_ROUTER_HISTORY_MODE` - 路由历史模式（`history`/`hash`/`memory`）

## Code Conventions

- UI 框架：Naive UI + Pro Naive UI，样式使用 UnoCSS 原子类
- 路径别名：`@/` → `src/`，`~/` → 项目根目录
- Lint 工具链：oxlint（correctness + suspicious 规则）+ eslint（@soybeanjs/eslint-config-vue）
- 格式化：oxfmt，行宽 120，单引号，无尾逗号
- 组件命名：PascalCase（Icon 组件 `icon-*` 开头除外）
- SCSS：全局变量通过 `@/styles/scss/global.scss` 自动注入
- 图标：Iconify 离线模式 + `src/assets/svg-icon/` 下的本地 SVG（使用 `icon-local-xxx` 格式引用）
