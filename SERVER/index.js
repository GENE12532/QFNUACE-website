/**
 * 主服务器文件 - Express.js 后端服务器
 * 功能：搭建RESTful API服务器，处理工单管理系统的所有HTTP请求
 * 包含：CORS跨域配置、中间件设置、路由配置、服务器启动
 * 作者：学习后端开发
 */

// ==================== 依赖导入 ====================
const express = require("express")  // Express.js框架，用于构建Web服务器
const cors = require("cors")         // CORS中间件，解决跨域问题

// 导入配置文件
const { SERVER_CONFIG, APP_CONFIG } = require("./config")

// 导入各个功能模块（CRUD操作）
const create_fun = require("./module/create");  // 创建工单功能
const search_fun = require("./module/search");  // 查询工单功能
const patch_fun = require("./module/patch")     // 更新工单功能
const delete_fun = require("./module/delete")   // 删除工单功能
const connectDB = require("./back")              // 数据库连接模块

// ==================== 服务器配置 ====================
const app = express()    // 创建Express应用实例
const PORT = SERVER_CONFIG.PORT; // 服务器监听端口号（从配置文件读取）

// ==================== 中间件配置 ====================

/**
 * CORS跨域配置中间件
 * 作用：允许前端应用访问后端API，解决浏览器同源策略限制
 */
app.use(cors(SERVER_CONFIG.CORS));

/**
 * JSON解析中间件
 * 作用：自动解析请求体中的JSON数据，并将其挂载到req.body上
 */
app.use(express.json());

/**
 * 请求日志中间件
 * 作用：记录每个HTTP请求的时间、方法和路径，便于调试和监控
 */
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next(); // 调用next()继续执行下一个中间件
});

// ==================== 健康检查路由 ====================

/**
 * 健康检查接口
 * 用于Docker容器健康检查和监控
 */
app.get(`${APP_CONFIG.API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'computer-repair-api',
    version: '1.0.0'
  });
});

// ==================== 服务器启动函数 ====================

/**
 * 启动服务器的异步函数
 * 流程：连接数据库 → 配置路由 → 启动HTTP服务器
 */
async function startServer(){
    let collection; // 数据库集合对象
    try{
        // 1. 连接数据库并获取集合对象
        collection = await connectDB();

        // 2. 创建API路由器，统一管理所有API路由
        const apiRouter = express.Router();
        
        // 3. 将各个功能模块注册到路由器上
        // 每个模块会在内部定义具体的路由路径和处理函数
        create_fun(apiRouter,collection);  // 注册创建工单的路由
        search_fun(apiRouter,collection);  // 注册查询工单的路由
        delete_fun(apiRouter,collection);  // 注册删除工单的路由
        patch_fun(apiRouter,collection);   // 注册更新工单的路由
        
        // 4. 将API路由器挂载到配置的路径前缀下
        // 这样所有API请求都需要以配置的前缀开头，如：/api/orders
        app.use(APP_CONFIG.API_PREFIX, apiRouter);

        // 5. 启动HTTP服务器，监听指定端口
        app.listen(PORT,() => {
            console.log(`服务器已成功启动，监听端口: ${PORT}`)
        })
    }catch(err){
        // 如果启动过程中出现错误，打印错误信息并退出程序
        console.log("错误：",err);
        process.exit(1); // 异常退出
    }
}

// ==================== 启动服务器 ====================
startServer(); // 调用启动函数