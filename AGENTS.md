# Soybean Admin 前端开发规范

本文件是 `soybean-admin` 前端项目的开发约定。它结合当前仓库配置和 SoybeanAdmin 官方路由文档，适用于 `src/`、`build/` 及前端配置文件的修改。

## 技术基线

- Vue 3、TypeScript、Vite、Naive UI、UnoCSS。
- 使用 `pnpm`，Node.js `>=20.19.0`，pnpm `>=10.5.0`。
- 使用 `@` 指向 `src`，不要引入新的别名或平行请求框架。
- 组件、Composable、API 和类型保持 TypeScript 类型安全；不要用 `any` 绕过类型错误。
- 页面样式优先使用项目已有的 UnoCSS 工具类和主题变量，避免局部重复定义全局样式。

## 目录约定

- `src/views/<route>/...`：页面路由组件。
- `src/service/api/<domain>/...`：按业务领域拆分接口；公共导出放在该领域的 `index.ts`，再由 `src/service/api/index.ts` 统一导出。
- `src/typings/`：全局和接口类型；接口响应类型放在对应 API 领域下。
- `src/router/`：路由运行时、守卫和路由工具。
- `src/router/elegant/`：Elegant Router 自动生成文件，只能通过路由文件结构或生成命令更新。
- `build/plugins/`：Vite 插件配置。新增插件前先确认是否已有同类能力。

## 路由规则

项目使用 `@elegant-router/vue/vite` 自动生成路由。路由是页面文件的副产物，新增、删除或重命名路由应操作 `src/views` 下的文件，而不是直接编辑 `src/router/elegant/`。

### 创建路由

优先使用：

```bash
pnpm gen-route
```

也可以手动创建，但必须遵循：

- 一级路由：`src/views/demo/index.vue`，生成路由名 `demo`。
- 二级路由：`src/views/demo/list/index.vue`，生成路由名 `demo_list`。
- 三级及以上路由：使用目录名中的 `_` 表达层级，例如 `src/views/demo/child_detail/index.vue`。
- 路由目录和页面组件不要同级放置 `index.vue` 与子目录；同一层级应统一采用页面或子路由结构。
- 路由名称使用小写字母、数字和短横线；层级之间使用下划线。路径使用短横线风格，例如 `external-agent`。
- 路由页面的 `template` 必须只有一个根元素。项目启用了页面过渡和根节点校验，注释、纯文本或多个根节点都会导致构建或运行时问题。

### 自动生成文件

启动开发服务后，插件会生成：

- `src/router/elegant/routes.ts`
- `src/router/elegant/imports.ts`
- `src/router/elegant/transform.ts`
- `src/typings/elegant-router.d.ts`

不要把业务逻辑写进这些生成文件，也不要依赖手工修改来长期修复路由。路由的 `component` 和 `meta` 属于插件允许保留的生成内容；如果需要稳定的自定义路由，使用 `src/router/routes/index.ts` 的 `customRoutes`，并在 `build/plugins/router.ts` 的 `customRoutes.names` 声明类型。

动态权限路由由后端返回，菜单的 `name`、`path`、`component` 必须和前端自动生成结果一致：

- 页面组件使用 `view.<RouteKey>`。
- 单级页面使用 `layout.base$view.<RouteKey>` 或 `layout.blank$view.<RouteKey>`。
- 有子路由的目录页面使用 `layout.base`，子页面使用 `view.<RouteKey>`。
- 移动或重命名页面后，同步更新后端菜单的路由名、路径和组件名，并重启开发服务重新生成路由文件。

### 路由元信息

- `title` 用于默认标题；有国际化时设置 `i18nKey: 'route.<RouteKey>'`。
- 角色限制使用 `meta.roles`，无需权限的常量路由使用 `meta.constant`。
- 不在菜单展示但需要被其他页面跳转的页面设置 `meta.hideInMenu: true`。
- 页面缓存使用 `meta.keepAlive`，不要通过重复注册路由实现刷新。
- 外链使用 `href` 或 `props.url`，不要把外部地址伪装成本地页面组件。

## 路由模式和权限

- `VITE_AUTH_ROUTE_MODE=static`：前端使用自动生成的静态路由，并按角色过滤。
- 动态模式下，前端通过 `fetchGetUserRoutes()` 获取后端路由，再调用 `getAuthVueRoutes()` 转换。
- 路由守卫负责登录、用户信息、动态路由初始化和未找到页面处理；业务权限判断放在现有权限设施中，不要在页面内复制守卫逻辑。
- 修改菜单权限时同时检查后端菜单种子、角色授权和前端路由组件映射，避免出现“菜单可见但组件找不到”。

## Vite 插件约定

当前插件链位于 `build/plugins/index.ts`，包含 Vue、JSX、Elegant Router、UnoCSS、自动导入/组件、开发工具、进度条、HTML 注入和根节点校验插件。

- `setupElegantRouter()` 是路由生成唯一入口；不要再引入第二套路由生成器。
- `vite-plugin-vue-transition-root-validator` 要求每个页面模板只有一个根元素。
- UnoCSS 类名应遵循现有预设和项目风格，新增主题值先检查 `uno.config.ts` 与 `src/styles`。
- 自动导入由 `build/plugins/unplugin.ts` 管理；能使用自动导入时不要重复手写全局注册。
- 修改插件配置后重启 Vite；生成文件、类型声明和缓存可能不会在当前进程中立即刷新。
- 只在确有必要时新增插件，并说明它的构建阶段、运行时影响和替代方案。

## API 与页面实现

- API 请求统一使用 `src/service/request` 和 `src/service/api` 的导出，不在页面中直接创建 Axios 实例或拼接基础 URL。
- 按领域拆分 API 文件，函数名使用 `fetch...` 约定，响应类型放在 `src/typings/api` 对应领域。
- 页面加载、提交、删除和批量操作都要处理 loading、错误提示和空数据状态。
- 表格页面优先复用项目已有的 `useTable`、`TableHeaderOperation`、分页和弹窗模式。
- 翻译文本放入 `src/locales/langs/`，路由翻译使用 `route.<RouteKey>`，页面文案使用 `page.<domain>...`。
- 保留现有组件、接口和路由的命名风格；修改公共类型时检查所有调用方。

## 验证命令

针对前端代码修改，至少运行：

```bash
pnpm typecheck
```

路由、组件或插件修改后建议运行：

```bash
pnpm lint
pnpm fmt
```

路由相关问题重点检查：

1. `src/views` 的文件路径是否生成了预期 `RouteKey`。
2. `src/router/elegant/imports.ts` 是否存在对应 `view.<RouteKey>`。
3. 动态菜单的 `name`、`path`、`component` 是否与前端一致。
4. 中英文 `route.<RouteKey>` 是否都存在。
5. 页面模板是否只有一个根元素。
6. `pnpm typecheck` 是否通过。

不要用 `pnpm build` 代替类型检查；只有发布或需要验证生产打包时才运行构建。

## 官方参考

- [系统路由概述](https://docs.soybeanjs.cn/zh/guide/router/intro)
- [路由创建](https://docs.soybeanjs.cn/zh/guide/router/create)
- [路由结构](https://docs.soybeanjs.cn/zh/guide/router/structure)
- [路由组件](https://docs.soybeanjs.cn/zh/guide/router/component)
- [SoybeanAdmin 文档](https://docs.soybeanjs.cn/zh/)
