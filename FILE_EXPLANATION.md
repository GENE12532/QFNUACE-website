# 📁 项目文件作用说明

## 🎯 根目录文件作用

### 1. [`package.json`](package.json:1) - 项目配置中心
**作用**: 统一管理整个项目的依赖和脚本
- **依赖管理**: 定义项目所需的所有npm包
- **脚本命令**: 提供一键启动、构建、部署等命令
- **项目信息**: 包含项目名称、版本、描述等元数据

**核心脚本**:
- `npm run install-all` - 安装所有依赖（前后端）
- `npm run dev` - 同时启动前后端开发服务器
- `npm run docker:up` - 使用Docker启动所有服务

### 2. [`docker-compose.yml`](docker-compose.yml:1) - 容器编排配置
**作用**: 一键启动完整的应用环境
- **MongoDB服务**: 自动启动数据库容器
- **后端API服务**: 启动Node.js后端服务
- **前端应用服务**: 启动Vue.js前端应用
- **数据持久化**: 自动保存数据库数据

### 3. [`.env`](.env:1) - 环境变量配置
**作用**: 集中管理所有配置参数
- **数据库配置**: MongoDB连接地址、数据库名
- **服务器配置**: 端口号、运行环境
- **应用配置**: 默认值、API地址等

### 4. [`.gitignore`](.gitignore:1) - Git忽略配置
**作用**: 指定不需要版本控制的文件
- 排除`node_modules/`目录
- 排除日志文件、临时文件
- 排除敏感配置文件

### 5. [`README.md`](README.md:1) - 项目说明文档
**作用**: 提供项目介绍和部署指南
- 项目功能介绍
- 快速启动说明
- 技术栈介绍

## 🚀 启动脚本作用

### 1. [`start.bat`](start.bat:1) - Windows批处理脚本
**作用**: Windows系统一键启动
- 检查Node.js和npm环境
- 验证环境配置文件
- 安装依赖并启动服务

### 2. [`start.ps1`](start.ps1:1) - Windows PowerShell脚本
**作用**: Windows系统一键启动（现代推荐）
- 更友好的用户界面
- 更好的错误处理
- 支持颜色输出

### 3. [`start.sh`](start.sh:1) - Linux/macOS脚本
**作用**: Unix系统一键启动
- 检查系统环境
- 自动设置执行权限
- 启动开发服务器

## 📂 子目录作用

### `scripts/` - 数据库初始化
- [`init-mongo.js`](scripts/init-mongo.js:1): 自动创建数据库、集合和索引

### `SERVER/` - 后端服务
- 提供RESTful API接口
- 处理业务逻辑和数据操作
- 连接MongoDB数据库

### `WEB/` - 前端应用
- Vue.js单页面应用
- 用户界面和交互逻辑
- 调用后端API

## 🔄 文件协作流程

### 启动流程:
1. **用户运行启动脚本** → 检查环境 → 安装依赖 → 启动服务
2. **Docker启动** → 读取`docker-compose.yml` → 启动所有容器
3. **后端启动** → 读取`.env`配置 → 连接数据库 → 启动API服务
4. **前端启动** → 读取`.env`配置 → 连接后端API → 启动Web服务

### 数据流程:
1. **前端** → 发送HTTP请求 → **后端API**
2. **后端API** → 操作数据库 → **MongoDB**
3. **MongoDB** → 返回数据 → **后端API** → **前端**

## 🛠️ 配置修改指南

### 修改数据库连接:
```env
# 在 .env 文件中修改
MONGODB_URL=mongodb://localhost:27017
DB_NAME=Work_order
```

### 修改服务器端口:
```env
# 在 .env 文件中修改
SERVER_PORT=3000
```

### 添加新功能:
1. 在`SERVER/module/`添加后端模块
2. 在`WEB/src/pages/`添加前端页面
3. 更新路由和API配置

## 📞 故障排除

### 启动失败:
- 检查Node.js版本 >= 16.0.0
- 确保MongoDB服务运行
- 验证`.env`文件存在且配置正确

### 端口冲突:
- 修改`.env`中的端口配置
- 检查端口是否被其他程序占用

### 依赖问题:
- 运行`npm run install-all`重新安装
- 清除`node_modules`后重新安装