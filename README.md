# Oven

`Oven` 是一个围绕训练计划执行主线构建的健身记录项目。

它的最终交付目标不是只做 Web 页面，而是形成同一套产品能力在下面三类终端上的统一交付：

- Web
- iOS
- Android

当前已经打通的核心主线是：

`创建计划 -> 开始计划 -> 执行当天训练 -> 本地恢复草稿 -> 原子提交正式记录 -> 回到仪表盘查看历史与统计`

## 项目结构

- `src/`
  - Angular 前端应用
- `packages/core/`
  - 前后端共享的核心模型、仓储契约和业务规则
- `server/`
  - NestJS 后端 + Prisma + SQLite 正式数据层

## 当前状态

- 前端主流程已可用
- 训练草稿仍然保留在前端本地
- 正式训练记录、用户计划、训练计划 definition 已进入后端正式持久化
- 训练会话正式提交统一走原子接口 `POST /user-plans/:id/logs`
- 首页仪表盘、计划详情、历史记录、基础统计的数据来源已经统一到后端
- 已接入真实认证，前端不再使用 mock user
- 周容量与月容量统计已切到服务端聚合接口
- 已新增计划完成率统计接口与仪表盘展示
- 已新增动作趋势统计接口与仪表盘展示
- 已启动多设备同步第一步：正式数据增量拉取与同步状态提示
- 已新增训练提交幂等保护，避免重复提交写脏正式数据
- 已新增基础冲突恢复：提交冲突后自动同步最新正式数据并保留本地草稿
- 已新增冲突分类语义：服务端按冲突类型返回 `code + recoveryAction`
- 最终目标已经明确为 `Web + iOS + Android` 三端统一交付
- 当前仍然只具备 Web 应用基础，还没有正式发布基础、PWA 壳和原生商店壳

## 项目文档

- 当前产品地图：`docs/current-product-map.md`
- 架构总览：`docs/architecture-overview.md`
- 认证流：`docs/authentication.md`
- 发布与跨端路线：`docs/release-strategy.md`
- 生产 Web 上线实施清单：`docs/production-web-release-runbook.md`
- 页面功能清单：`docs/page-function-checklist-for-ui-ux.md`
- 进度归档：`docs/progress-archive.md`
- Roadmap：`docs/roadmap.md`
- 下一步执行计划：`docs/next-step-plan.md`

## 最终发布路线

当前最现实的发布路线不是直接冲商店，而是按下面顺序推进：

1. 先完成生产 Web 发布基础
2. 再补移动端 Web 适配
3. 再补最小 PWA
4. 再补完整多设备同步
5. 最后接 iOS / Android 原生壳和商店发布

当前真实状态：

- 已具备 Web 主流程
- 还没有 production 发布基础
- 还没有 PWA manifest / service worker
- 还没有 iOS / Android 原生壳

## 本地启动

### 前端

```bash
npm start
```

默认地址：

```text
http://localhost:17173
```

### 后端

启动前请确认 `server/.env` 已配置：

```text
DATABASE_URL=...
JWT_SECRET=...
```

```bash
npm run start:server
```

默认地址：

```text
http://localhost:3000
```

健康检查：

```text
http://localhost:3000/health
```

前端当前通过 Angular environment 读取 API 地址：

```text
src/environments/environment.ts
src/environments/environment.development.ts
```

默认开发环境 API 地址：

```text
http://localhost:3000
```

## 当前后端接口

```text
GET    /
GET    /health
POST   /auth/register
POST   /auth/login
GET    /auth/session
POST   /auth/logout
GET    /auth/me
GET    /workout-plans?updatedAfter=...&limit=...
GET    /workout-plans/:id
POST   /workout-plans
GET    /workout-logs?updatedAfter=...&limit=...
GET    /workout-logs/exercise-trends?limit=...
GET    /workout-logs/volume?bucket=week|month&limit=...
GET    /workout-logs/:id
GET    /workout-logs/last?exerciseId=...
POST   /workout-logs
GET    /user-plans?updatedAfter=...&limit=...
GET    /user-plans/completion-rate
GET    /user-plans/:id
GET    /user-plans/active
POST   /user-plans
POST   /user-plans/:id/logs
POST   /user-plans/:id/resume
POST   /user-plans/:id/archive
```

接口边界说明：

- `POST /auth/register` / `POST /auth/login` 会直接返回可用会话
- `GET /auth/session` 用于浏览器刷新后的会话恢复
- `POST /user-plans/:id/logs` 是正式训练记录的唯一提交入口
- `POST /user-plans/:id/logs` 现在支持可选 `clientRequestId`，用于重复提交幂等保护
- `POST /user-plans/:id/logs` 发生冲突时会返回明确的 `code + recoveryAction`
- `GET /workout-plans` / `GET /user-plans` / `GET /workout-logs` 现在支持 `updatedAfter` 增量拉取
- `GET /workout-logs/exercise-trends` 提供最近动作容量变化趋势
- `GET /workout-logs/volume` 提供周/月训练容量的服务端聚合结果
- `GET /user-plans/completion-rate` 提供已完结计划完成率统计，active plan 不计入失败
- `POST /workout-logs` 当前会拒绝正式写入，防止绕过“写日志 + 推进计划”的原子链路
- `POST /user-plans/:id/resume` 用于恢复中断计划
- `POST /user-plans/:id/archive` 用于归档历史计划
- `user-plans` 与 `workout-logs` 现在从认证会话中推导用户身份，不再相信前端提交的 `userId`

## 当前产品边界

- 草稿仍然只保存在前端本地，绑定 `userPlanId + trainingDayId + dayIndex`
- 正式训练记录只认后端
- 跳过训练与完成训练都走同一条原子提交链路
- 当前已具备注册、登录、注销和基础权限校验
- 当前已具备周容量和月容量的服务端统计
- 当前已具备计划完成率服务端统计
- 当前已具备动作趋势服务端统计
- 当前已具备正式数据的最小多设备同步拉取
- 当前已具备训练会话提交的请求级幂等保护
- 当前已具备“服务端为准”的基础冲突恢复
- 当前已具备按冲突类型分流的恢复策略
- 当前仍没有跨设备草稿同步、复杂冲突合并和离线重放
- 当前仍没有正式 Web 部署配置、PWA 安装壳和原生商店发布壳

## 构建

前端构建：

```bash
npm run build
```

后端构建：

```bash
cd server
npm run build
```

## 测试

根目录测试：

```bash
npm test
```

后端测试：

```bash
cd server
npx jest --config jest.config.js --runInBand
```
