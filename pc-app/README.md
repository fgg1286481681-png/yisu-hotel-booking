# 易宿酒店管理后台（PC）

这是一个用于演示 **登录 / 注册 / 会话恢复** 的前端（React + Vite + Ant Design）+ Mock 后端（Express）的最小闭环项目。

## 启动方式（本地）

打开两个终端（PowerShell / CMD 均可），都进入：

`C:\Users\15162\Desktop\yisu-hotel-booking\pc-app`

### 1）安装依赖

```bash
npm install
```

### 2）启动 Mock 后端（端口 3001）

```bash
npm run mock
```

看到类似输出代表成功：

- `Mock auth server is running at http://localhost:3001`

### 3）启动前端（端口 5173）

另开一个终端：

```bash
npm run dev
```

然后浏览器打开：

- `http://localhost:5173`

## 怎么验证“结果是不是对的”

- **注册**：访问 `http://localhost:5173/register`，填邮箱/密码/确认密码/昵称/角色，提交后会自动跳转到 `/dashboard`
- **刷新保持登录**：在 `/dashboard` 刷新页面，应仍然保持登录（基于 `localStorage` 的 `auth_token` + `/api/auth/me`）
- **退出**：点击顶部“退出登录”，应回到登录页
- **再次登录**：访问 `http://localhost:5173/login`，使用刚注册的邮箱/密码登录

## 数据存在哪里

Mock 用户数据写入：

- `mock/db.json`

## 接口（Mock）

- `POST http://localhost:3001/api/auth/register`
- `POST http://localhost:3001/api/auth/login`
- `GET  http://localhost:3001/api/auth/me`（Header: `Authorization: Bearer <token>`）

