# 生产 Web 上线实施清单

## 文档目的

这份文档只做一件事：

`把 oven 从本地开发项目推进到可正式上线的 Web 产品`

它不讨论 PWA、iOS、Android 商店细节。
它只覆盖当前最应该先做实的阶段：

- 生产 Web 发布基础

## 当前判断

当前项目已经具备：

- Angular 前端主流程
- NestJS 后端正式数据层
- 真实认证
- 服务端统计
- 正式数据最小同步链路

当前仓库已经具备：

- 前端 production 环境文件和构建替换
- 后端 `PORT` / `CORS_ORIGIN` 环境变量入口
- 前端静态部署配置
- 后端 Docker 部署骨架
- 前后端上线实施清单

当前阶段已经完成的真实发布结果：

- 前端正式地址：`https://oven-two.vercel.app`
- 后端正式地址：`https://oven-production.up.railway.app`
- 数据库方案：Turso
- 部署组合：
  - 前端：Vercel
  - 后端：Railway
  - 数据库：Turso
- CORS 已收口到：`https://oven-two.vercel.app`

当前这份文档的角色已经从“待执行清单”变成“已落地的 Web 发布记录 + 后续复用手册”。

## 推荐部署组合

当前最现实的组合是：

- 前端：Vercel
- 后端：Railway 或 Render
- 数据库：Turso

原因：

- 前端本质上是 Angular 静态产物
- 后端本质上是 NestJS 长驻服务
- 当前后端已经走 `libsql` / Prisma 路线，云端数据库最顺的是 Turso

## 已由仓库落地的步骤

- [x] 新增生产环境文件 `src/environments/environment.production.ts`
- [x] 修正默认 `environment.ts` 为本地开发配置
- [x] 为 Angular production 构建补上环境文件替换
- [x] 后端改为从环境变量读取 `PORT`
- [x] 后端改为从环境变量读取 `CORS_ORIGIN`
- [x] 新增 `server/.env.example`
- [x] 新增后端 Docker 构建文件 `Dockerfile.server`
- [x] 新增 `.dockerignore`
- [x] 新增前端 `vercel.json`

## 当前已完成的发布事实

当前生产 Web 发布基础已完成，并已验证通过以下主流程：

- 注册
- 登录
- 会话恢复
- 创建计划
- 开始计划
- 完成训练
- 跳过训练
- 正式数据同步
- 历史记录
- 统计

当前真机验证状态：

- 平板：已通过
- iPhone Safari：暂未验证
- Android Chrome：暂未验证

当前已知剩余问题：

- 暂无明确阻塞问题
- 下一阶段重点已经转向移动端 Web 适配与最小 PWA

## 实施步骤

## 第 1 步：准备生产环境变量

后端至少需要这些环境变量：

```env
DATABASE_URL="libsql://your-turso-database-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"
JWT_SECRET="replace-with-a-long-random-secret"
PORT="3000"
CORS_ORIGIN="https://oven.example.com"
```

文件参考：

- `server/.env.example`

前端 production API 地址当前写在：

- `src/environments/environment.production.ts`

默认占位值是：

```ts
https://api.oven.example.com
```

在正式上线前，你必须把它改成你的真实后端域名。

## 第 2 步：创建云数据库

建议直接使用 Turso。

你需要完成：

1. 创建数据库
2. 生成数据库连接串
3. 生成数据库认证令牌
4. 把连接串填进后端 `DATABASE_URL`
5. 把认证令牌填进后端 `TURSO_AUTH_TOKEN`
6. 在部署后端前完成数据库初始化

当前项目的生产环境已经切到 Turso，并通过应用启动时的 libsql migration runner 执行迁移，不再依赖生产环境直接执行 `prisma migrate deploy`。

## 第 3 步：部署后端

当前仓库已经准备了：

- `Dockerfile.server`

建议路线：

- Railway：使用 Dockerfile 部署
- Render：使用 Dockerfile 部署

部署要点：

1. 构建上下文使用仓库根目录
2. Dockerfile 指向 `Dockerfile.server`
3. 配置环境变量：
   - `DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET`
   - `PORT`
   - `CORS_ORIGIN`
4. 部署成功后验证：
   - `/health`
   - 注册
   - 登录
   - 获取会话
   - 获取计划库

健康检查地址示例：

```text
https://api.your-domain.com/health
```

当前正式后端地址：

```text
https://oven-production.up.railway.app
```

## 第 4 步：部署前端

当前仓库已经准备了：

- `vercel.json`

建议路线：

- 使用 Vercel 直接部署仓库根目录

部署要点：

1. 确认 `src/environments/environment.production.ts` 已指向真实后端域名
2. 触发 `npm run build`
3. 确认输出目录为：

```text
dist/oven/browser
```

4. 部署后验证：
   - 首页能打开
   - 不再请求 `localhost`
   - 登录成功
   - 刷新后会话可恢复
   - 仪表盘数据正常

当前正式前端地址：

```text
https://oven-two.vercel.app
```

## 第 5 步：收口正式域名与 CORS

当前后端会从 `CORS_ORIGIN` 读取允许域名。

建议正式值只写你的前端域名，例如：

```env
CORS_ORIGIN="https://oven-web.vercel.app,https://oven.example.com"
```

不要继续保留全开 CORS。

当前已生效配置：

```env
CORS_ORIGIN="https://oven-two.vercel.app"
```

## 第 6 步：真机验证

至少要验证下面这些真实路径：

1. iPhone Safari 打开首页
2. Android Chrome 打开首页
3. iPad 或 Android 平板打开首页
4. 注册 / 登录
5. 创建计划
6. 进入训练页
7. 提交完成训练
8. 仪表盘同步状态正常

当前已完成验证：

- 平板浏览器访问通过
- 注册 / 登录通过
- 创建计划通过
- 开始计划通过
- 提交完成训练通过
- 跳过训练通过
- 仪表盘同步状态通过

当前暂未完成：

- iPhone Safari 真机验证
- Android Chrome 真机验证

## 验收标准

只要下面这些成立，就说明“生产 Web 发布基础”已经完成：

- 前端与后端都跑在正式域名上
- 前端不再请求 localhost
- 数据库已经在云端
- 至少桌面与平板主流程已验证通过
- 关键主流程可以走通

当前项目已经满足以上标准，因此“生产 Web 发布基础”状态应判定为：已完成

## 当前阶段明确不做的事

这一阶段不要碰：

- PWA manifest
- service worker
- iOS / Android 原生壳
- App Store / Google Play 提审
- 完整离线能力

原因很简单：

这些都建立在稳定的正式 Web 发布之上。

## 下一阶段

生产 Web 发布基础完成后，下一步顺序是：

1. 移动端 Web 适配
2. 最小 PWA
3. 完整多设备同步
4. iOS / Android 原生壳和商店发布

## 本轮产物

本轮已经新增或修改：

- `src/environments/environment.ts`
- `src/environments/environment.production.ts`
- `angular.json`
- `server/src/main.ts`
- `server/.env.example`
- `Dockerfile.server`
- `.dockerignore`
- `vercel.json`
- `docs/production-web-release-runbook.md`

## 一句话总结

`oven` 已经完成生产 Web 发布基础，当前下一步不是重复部署，而是补移动端 Web 适配和最小 PWA。`
