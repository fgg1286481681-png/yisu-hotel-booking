# 易宿酒店预订平台

易宿酒店预订平台是一个前后端分离的酒店预订项目，包含 PC 管理端、移动端小程序和后端服务。PC 端用于酒店、房型、审核等管理操作；移动端用于酒店搜索、列表浏览、详情查看和订单预订；后端提供认证、酒店、房型、订单等接口能力。

## 技术栈

| 模块 | 技术框架 | 说明 |
| --- | --- | --- |
| PC 管理端 | React 18 + Ant Design 5 + Vite 5 | 酒店管理、房型管理、审核管理 |
| 移动端小程序 | Taro 4 + React + Vite 4 | 微信小程序端酒店预订流程 |
| 后端服务 | Express + TypeScript + Prisma + SQLite | API 服务、认证、数据持久化 |
| 共享模块 | JavaScript/TypeScript | 多端共享数据和适配逻辑 |

## 项目结构

```text
yisu-hotel-booking
├─ backend       后端服务
├─ pc-app        PC 管理端
├─ mobile-app    Taro 移动端小程序
├─ shared        共享数据和工具
├─ tools         辅助工具脚本
└─ 简历落地问题   项目落地说明文档
```

## 环境要求

- Windows 11
- PowerShell
- Node.js 18 或更高版本
- npm
- 微信开发者工具，用于预览微信小程序

## 安装依赖

在项目根目录分别安装三个子项目依赖：

```powershell
Set-Location E:\yisu-hotel-booking\backend
npm install

Set-Location E:\yisu-hotel-booking\pc-app
npm install

Set-Location E:\yisu-hotel-booking\mobile-app
npm install
```

## 启动后端服务

```powershell
Set-Location E:\yisu-hotel-booking\backend
npm run db:push
npm run prisma:seed
npm run dev
```

默认后端服务由 `backend\src\server.ts` 启动，接口供 PC 端和移动端调用。

## 启动 PC 管理端

新开一个 PowerShell 窗口：

```powershell
Set-Location E:\yisu-hotel-booking\pc-app
npm run dev
```

启动后根据终端输出访问本地 Vite 地址，通常是：

```text
http://localhost:5173
```

## 启动移动端小程序

新开一个 PowerShell 窗口：

```powershell
Set-Location E:\yisu-hotel-booking\mobile-app
npm run dev:weapp
```

编译完成后，使用微信开发者工具打开：

```text
E:\yisu-hotel-booking\mobile-app
```

小程序编译产物位于：

```text
E:\yisu-hotel-booking\mobile-app\dist
```

## 常用命令

### 后端

```powershell
npm run dev              # 开发模式启动
npm run build            # TypeScript 构建
npm run db:push          # 同步 Prisma 数据库结构
npm run prisma:seed      # 写入种子数据
npm run studio           # 打开 Prisma Studio
```

### PC 管理端

```powershell
npm run dev              # 启动开发服务器
npm run build            # 构建生产包
npm run preview          # 预览构建结果
```

### 移动端小程序

```powershell
npm run dev:weapp        # 微信小程序开发模式
npm run build:weapp      # 微信小程序生产构建
npm run dev:h5           # H5 开发模式
```

## 启动顺序建议

1. 启动 `backend` 后端服务。
2. 启动 `pc-app` PC 管理端。
3. 启动 `mobile-app` 小程序编译监听。
4. 在浏览器访问 PC 管理端。
5. 在微信开发者工具中打开移动端项目。

## 说明

移动端接口默认请求本地后端地址。开发时请确保后端服务已启动，并确认小程序开发者工具中已开启“不校验合法域名”相关设置，方便本地联调。
