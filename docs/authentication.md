# 认证流

## 文档目的

这份文档只说明三件事：

- 当前认证链路怎么工作
- 前后端分别承担什么职责
- 本地开发怎么验证登录、注册和会话恢复

## 当前认证边界

当前已经接入真实认证主路径：

- 注册：`POST /auth/register`
- 登录：`POST /auth/login`
- 会话恢复：`GET /auth/session`
- 注销：`POST /auth/logout`
- 当前用户资料：`GET /auth/me`

前端已经不再使用 mock user。

`/workout-log` 及其子路径全部要求登录后访问。

## 前端实现

位置：

- `src/app/auth/`
- `src/app/features/auth/`

当前前端认证流由四部分组成：

- `AuthService`
  - 持有当前用户和 access token
  - 负责注册、登录、会话恢复、注销
- `authGuard`
  - 保护 `/workout-log`
  - 未登录时跳到 `/auth/login`
- `guestOnlyGuard`
  - 防止已登录用户重新回到登录/注册页
- `authInterceptor`
  - 自动附加 `Authorization: Bearer <token>`
  - 收到 `401` 时清理本地会话并跳回登录页

前端当前会把 access token 保存在 `localStorage`：

```text
oven.auth.access-token
```

这是当前阶段最实用的选择。项目还没有进入多设备同步、跨站部署和 refresh token 轮换阶段，没必要先把问题复杂化。

## 后端实现

位置：

- `server/src/auth/`
- `server/prisma/schema.prisma`

当前后端新增两张表：

- `User`
  - 保存邮箱、用户名、显示名、密码哈希
- `AuthSession`
  - 保存 access token 的哈希值和过期时间

当前策略：

- 密码使用 Node.js `crypto.scrypt` 哈希
- access token 只把哈希落库，不直接保存明文
- 会话默认有效期 7 天
- `user-plans`、`workout-logs` 现在从会话里推导用户身份
- `workout-plans` 的创建也要求登录

这一步的关键不是“多高级”，而是把用户身份放进正式数据链路，让接口不再相信前端自己传来的 `userId`。

## 分步执行记录

这轮认证不是一次性重写，而是按下面顺序收口：

### 第 1 步：后端身份基础

- 补 `User` / `AuthSession` 数据模型
- 保留已有业务表上的 `userId`
- 让认证先成为正式数据链路的入口，而不是另起一套用户系统

### 第 2 步：注册 / 登录闭环

- 后端提供 `POST /auth/register`
- 后端提供 `POST /auth/login`
- 注册和登录都会直接签发 Bearer Token
- Token 对应的会话哈希会写入 `AuthSession`

### 第 3 步：会话恢复 / 注销

- 前端启动时尝试恢复本地 token
- 后端提供 `GET /auth/session`
- 后端提供 `POST /auth/logout`
- 注销时删除对应 token 的会话记录，避免“前端删了，本地以外仍有效”的假注销

### 第 4 步：业务接口切换到认证上下文

- `user-plans` 不再接受前端显式传入 `userId`
- `workout-logs` 不再接受前端显式传入 `userId`
- 业务接口统一从 `Authorization: Bearer <token>` 解析当前用户

### 第 5 步：前端主路径替换 mock user

- 登录 / 注册页接入
- `/workout-log` 路由加守卫
- HTTP 拦截器自动附加 Bearer Token
- 收到 `401` 时清理本地会话并返回登录页

## 现在的 API 边界

认证后端接管用户身份，下面这些接口不再接受前端显式传入 `userId`：

- `GET /user-plans`
- `GET /user-plans/active`
- `GET /workout-logs`
- `GET /workout-logs/last?exerciseId=...`
- `POST /user-plans`
- `POST /user-plans/:id/logs`
- `POST /user-plans/:id/resume`
- `POST /user-plans/:id/archive`

这就是“把特殊情况消掉”。

以前前端一边拿 mock user，一边再把 `userId` 塞回接口。
现在用户是谁由会话决定，正式接口只接收真正的业务参数。

## 本地默认账户

为了不打断现有 `user-1` 本地数据，迁移脚本会插入一个默认账户：

```text
邮箱: john.doe@example.com
用户名: john-doe
密码: oven-demo-123
```

这只是本地开发用的保底入口，不是生产方案。

## 验证步骤

### 1. 启动服务

后端需要 `server/.env`：

```text
DATABASE_URL=...
JWT_SECRET=...
```

前端：

```bash
npm start
```

后端：

```bash
npm run start:server
```

### 2. 登录验证

- 打开 `http://localhost:17173`
- 未登录时会被重定向到 `/auth/login`
- 使用默认账户登录
- 成功后进入 `/workout-log`

### 3. 注册验证

- 打开 `/auth/register`
- 注册新账户
- 成功后自动创建会话并进入仪表盘
- 新账户只看到自己的正式数据

### 4. 会话恢复验证

- 登录成功后刷新浏览器
- 前端会调用 `GET /auth/session`
- 会话有效时直接恢复当前用户

### 5. 注销验证

- 仪表盘右上角点击“退出”
- 前端调用 `POST /auth/logout`
- 本地 token 被清理
- 页面回到 `/auth/login`
