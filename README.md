# 电脑维修工单管理系统

## 📋 项目简介

这是一个基于Vue.js + Node.js + MongoDB的电脑维修工单管理系统，专为电脑维修服务提供商设计。系统提供了完整的工单生命周期管理功能，包括工单创建、查询、更新和删除等核心功能。

### 主要特性

- 🚀 **现代化技术栈**：Vue 3 + Element Plus + Node.js + Express + MongoDB
- 📝 **完整的CRUD操作**：支持工单的增删改查
- 🔍 **多条件搜索**：支持按被诊者、号码、电脑型号、业务类型等多种条件搜索
- 📱 **响应式设计**：适配桌面端和移动端
- 🛡️ **数据验证**：前后端双重数据验证
- 🎨 **美观的UI界面**：基于Element Plus的现代化界面设计

## 🏗️ 项目结构

```
QFNUACE-website/
├── README.md                 # 项目说明文档
├── SERVER/                   # 后端服务器
│   ├── index.js             # 服务器入口文件
│   ├── back.js              # 数据库连接配置
│   ├── package.json         # 后端依赖配置
│   └── module/              # 业务模块
│       ├── create.js        # 创建工单模块
│       ├── search.js        # 查询工单模块
│       ├── patch.js         # 更新工单模块
│       └── delete.js        # 删除工单模块
└── WEB/                     # 前端应用
    ├── index.html           # HTML入口文件
    ├── package.json         # 前端依赖配置
    ├── vite.config.js       # Vite配置文件
    └── src/                 # 源代码目录
        ├── App.vue          # 根组件
        ├── main.js          # 应用入口
        ├── components/      # 公共组件
        │   ├── Header.vue   # 头部组件
        │   └── Roller.vue   # 功能导航组件
        ├── config/          # 配置文件
        │   └── api.js       # API配置
        ├── layouts/         # 布局组件
        │   └── MainLayout.vue
        ├── pages/           # 页面组件
        │   ├── function1.vue # 创建工单页面
        │   ├── function2.vue # 查询工单页面
        │   ├── function3.vue # 更新工单页面
        │   ├── function4.vue # 删除工单页面
        │   └── HomeContent.vue
        ├── router/          # 路由配置
        │   └── router.js
        └── types/           # TypeScript类型定义
            └── global.d.ts
```

## 🛠️ 技术栈

### 前端技术
- **Vue 3**: 渐进式JavaScript框架
- **Element Plus**: Vue 3的UI组件库
- **Vue Router**: Vue.js官方路由管理器
- **Axios**: HTTP客户端库
- **Vite**: 现代化的前端构建工具
- **TailwindCSS**: 实用优先的CSS框架
- **TypeScript**: JavaScript的超集，提供静态类型检查

### 后端技术
- **Node.js**: JavaScript运行时环境
- **Express.js**: Web应用框架
- **MongoDB**: NoSQL文档数据库
- **CORS**: 跨域资源共享中间件

## 📊 数据结构

### 工单数据模型

```javascript
{
  "_id": "ObjectId",           // MongoDB自动生成的ID
  "日期": "2025.3.5",          // 工单日期
  "年级学院": "xx学院",         // 客户年级学院
  "被诊者": "王大狗",          // 客户姓名
  "联系": "电话",              // 联系方式类型
  "号码": "xxxxxxxxxx",       // 联系号码
  "电脑型号": "xx电脑",   // 电脑型号
  "业务": "清灰",              // 业务类型
  "操作人员": "张三",        // 操作人员
  "检察人员": "李四、王五",   // 检察人员
  "备注": "反装主板",          // 备注信息
  "创建时间": "Date",          // 创建时间
  "更新时间": "Date",          // 更新时间
  "状态": "待处理"             // 工单状态
}
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.0
- npm >= 8.0.0
- 或 Docker & Docker Compose（推荐）

### 启动方式

#### 方式一：npm 命令（最简单）
```bash
# 安装所有依赖
npm run install-all

# 启动开发服务器
npm run dev
```

#### 方式二：Docker 部署（推荐）
```bash
# 一键启动所有服务（包括MongoDB）
npm run docker:up
```

#### 方式三：启动脚本
- **Windows**: 运行 `start.bat`
- **Linux/macOS**: 运行 `./start.sh`

### 访问地址
- 前端应用: http://localhost:5173
- 后端API: http://localhost:3000

### 环境配置
复制 `.env.example` 为 `.env` 并根据需要修改配置。

## 📖 功能说明

### 1. 创建工单
- 填写完整的维修工单信息
- 支持必填字段验证
- 自动生成创建时间
- 提供业务类型选择

### 2. 查询工单
- 支持多条件搜索
- 可按被诊者、号码、电脑型号、业务类型等条件查询
- 表格形式展示搜索结果
- 支持结果排序

### 3. 更新工单
- 通过工单ID搜索现有工单
- 支持修改所有工单字段
- 提供修改确认机制
- 自动记录更新时间

### 4. 删除工单
- 通过工单ID搜索工单
- 显示完整工单信息供确认
- 二次确认删除操作
- 不可恢复的安全删除

## 🔧 API接口

### 基础URL
```
http://localhost:3000/api
```

### 接口列表

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/create` | 创建新工单 |
| GET | `/orders` | 查询工单列表 |
| GET | `/orders/:id` | 获取单个工单 |
| PATCH | `/orders/:id` | 更新工单 |
| DELETE | `/orders/:id` | 删除工单 |

### 请求示例

**创建工单**
```javascript
POST /api/create
Content-Type: application/json

{
  "日期": "2025.3.5",
  "年级学院": "xx学院",
  "被诊者": "王大狗",
  "联系": "电话",
  "号码": "xxxxxxxxxx",
  "电脑型号": "xx电脑",
  "业务": "清灰",
  "操作人员": "张三",
  "检察人员": "李四、王五",
  "备注": "反装主板"
}
```

**查询工单**
```javascript
GET /api/orders?被诊者=孙晓洋&业务=清灰
```

## 🛡️ 错误处理

系统提供了完善的错误处理机制：

- **网络连接错误**: 自动检测服务器连接状态
- **数据验证错误**: 前后端双重验证
- **操作确认**: 危险操作需要用户确认
- **友好提示**: 所有操作都有相应的成功/失败提示

## 🔍 故障排除

### 常见问题

1. **无法连接到服务器**
   - 检查后端服务是否启动
   - 确认端口3000未被占用
   - 检查防火墙设置

2. **数据库连接失败**
   - 确认MongoDB服务正在运行
   - 检查数据库连接字符串
   - 验证数据库权限

3. **前端页面无法加载**
   - 检查前端服务是否启动
   - 确认端口5173未被占用
   - 清除浏览器缓存

## 📝 开发说明

### 代码规范
- 使用ES6+语法
- 遵循Vue 3 Composition API规范
- 使用TypeScript进行类型检查
- 统一的错误处理机制

### 扩展开发
- 添加新功能模块到`SERVER/module/`目录
- 创建对应的前端页面到`WEB/src/pages/`目录
- 更新路由配置和API配置
- 添加相应的类型定义

## 📄 许可证

本项目采用 MIT 许可证。

## 👥 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues]
- 邮箱: [your-email@example.com]

---

**注意**: 请确保在生产环境中修改默认的数据库连接配置和安全设置。
