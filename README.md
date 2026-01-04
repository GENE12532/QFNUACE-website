# 电脑维修工单管理系统 (Computer Repair Work Order System)

这是一个基于 Vue 3 和 Node.js 的全栈电脑维修工单管理系统，旨在帮助网络部或维修团队高效地管理维修工单。系统包含工单的创建、查询、更新和删除 (CRUD) 等核心功能，并支持 Docker 容器化部署。

## 🛠 技术栈

### 前端 (WEB)
- **核心框架**: [Vue 3](https://vuejs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **样式库**: [TailwindCSS](https://tailwindcss.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由管理**: [Vue Router](https://router.vuejs.org/)

### 后端 (SERVER)
- **运行环境**: [Node.js](https://nodejs.org/)
- **Web 框架**: [Express](https://expressjs.com/)
- **数据库**: [MongoDB](https://www.mongodb.com/)
- **ODM**: [Mongoose](https://mongoosejs.com/)

### 部署与运维
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx
- **自动化脚本**: Shell (.sh) / Batch (.bat) / PowerShell (.ps1)

## 📂 目录结构

```text
.
├── SERVER/                 # 后端项目目录
│   ├── module/             # 业务逻辑模块 (增删改查)
│   ├── config.js           # 配置文件
│   ├── db.js               # 数据库连接
│   ├── index.js            # 入口文件
│   └── ...
├── WEB/                    # 前端项目目录
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── layouts/        # 布局组件
│   │   ├── pages/          # 页面视图 (Create, Delete, Search, Update)
│   │   ├── router/         # 路由配置
│   │   └── ...
│   ├── vite.config.js      # Vite 配置
│   └── ...
├── scripts/                # 数据库初始化脚本
├── docker-compose.yml      # Docker 编排文件
├── start.bat               # Windows 一键启动脚本
├── deploy.bat              # Windows 部署脚本
└── nginx.conf              # Nginx 配置文件
```

## 🚀 快速开始

### 前置要求
- Node.js (>=16.0.0)
- npm (>=8.0.0)
- MongoDB (如果非 Docker 启动)

### 方式一：使用一键启动脚本 (Windows 推荐)

项目提供了便捷的启动脚本，会自动检查环境、安装依赖并启动服务。

双击运行根目录下的 [`start.bat`](start.bat) 即可。

### 方式二：使用 Docker 启动

如果您已安装 Docker，可以直接使用 Docker Compose 一键构建并启动所有服务（包含 MongoDB）。

```bash
docker-compose up -d
```

启动后访问：
- **前端页面**: `http://localhost:5173`
- **后端接口**: `http://localhost:3000`

### 方式三：手动安装与启动

1. **启动 MongoDB**
   确保本地 MongoDB 服务已启动，默认端口 `27017`。

2. **后端服务 (SERVER)**
   ```bash
   cd SERVER
   npm install
   npm start
   # 或开发模式: npm run dev
   ```

3. **前端应用 (WEB)**
   ```bash
   cd WEB
   npm install
   npm run dev
   ```

## ⚙️ 配置说明

### 环境变量
项目主要依赖以下环境变量（通常在 Docker 配置或 `.env` 中设置）：

- `MONGODB_URL`: MongoDB 连接地址
- `SERVER_PORT`: 后端服务端口 (默认 3000)
- `VITE_API_BASE_URL`: 前端调用的 API 基础地址

### 数据库初始化
Docker 启动时会自动挂载 [`scripts/init-mongo.js`](scripts/init-mongo.js) 对数据库进行初始化。

## 📄 许可证
ISC
