# 易宿酒店预订平台

酒店预订小程序，支持PC端管理与移动端预订

## 技术栈

| 端 | 框架 | UI库 | 构建工具 |
|---|------|------|----------|
| PC端 | React 18 | Ant Design 5 | Vite 5 |
| 移动端 | Taro 4 (React) | - | Vite 4 |

## 快速开始

```bash
# 安装依赖
cd pc-app && npm install
cd ../mobile-app && npm install

# 启动PC端
cd pc-app && npm run dev

# 启动移动端（微信小程序）
cd mobile-app && npm run dev:weapp
下载微信开发者工具查看效果
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 启动服务器（mock）
cd pc-app && npm run mock

## 核心功能

✅ **数据实时同步**：PC端新增酒店→移动端3秒内可见  
✅ **性能优化**：请求缓存+分包加载，列表秒开  

## 项目结构

```
yisu-hotel-booking/
├── pc-app/              # PC端管理后台
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # 公共组件
│   │   └── services/    # API服务
│   └── mock/            # Mock数据
├── mobile-app/          # 移动端小程序
│   ├── src/
│   │   ├── pages/       # 页面
│   │   ├── components/  # 组件
│   │   ├── services/    # 请求服务
│   │   └── utils/       # 工具函数
│   └── dist/            # 编译输出
└── shared/             # 共享类型
```
