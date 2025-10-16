/**
 * 查询工单模块 (Read - CRUD中的R)
 * 功能：处理工单的查询请求，支持多条件搜索和单个工单查询
 * 路由：GET /api/orders (查询多个) 和 GET /api/orders/:id (查询单个)
 * 作者：学习后端开发
 */

// 导入配置文件
const { APP_CONFIG } = require("../config")

/**
 * 导出查询工单功能模块
 * @param {Express.Router} app - Express路由器对象
 * @param {MongoDB.Collection} collection - MongoDB集合对象，用于数据库操作
 */
module.exports = (app, collection) => {
    
    /**
     * 多条件查询工单的异步处理函数
     * 支持模糊搜索多个字段，实现灵活的工单检索功能
     * @param {Express.Request} req - HTTP请求对象，查询参数通过req.query获取
     * @param {Express.Response} res - HTTP响应对象，用于返回查询结果
     */
    const search_fun = async (req, res) => {
        try {
            // ==================== 1. 构建查询条件 ====================
            const query = {}; // MongoDB查询对象，用于存储所有查询条件
            
            // ==================== 2. 处理各种搜索字段 ====================
            // 使用正则表达式实现模糊搜索，$options: 'i' 表示忽略大小写
            
            // 动态处理所有配置的搜索字段
            APP_CONFIG.SEARCH_FIELDS.forEach(field => {
                if (req.query[field]) {
                    query[field] = { $regex: req.query[field], $options: 'i' };
                }
            });

            // 打印查询条件，便于调试
            console.log('查询条件:', query);

            // ==================== 3. 执行数据库查询 ====================
            // 执行查询并按创建时间倒序排列（最新的工单排在前面）
            const results = await collection.find(query).sort({ 创建时间: -1 }).toArray();

            // ==================== 4. 返回查询结果 ====================
            res.status(200).json({
                code: 200,
                message: `成功查询到 ${results.length} 条工单`,
                data: results  // 返回所有匹配的工单数据
            });

        } catch (err) {
            // ==================== 5. 错误处理 ====================
            console.error("查询工单错误：", err);

            res.status(500).json({
                code: 500,
                message: "服务器查询工单失败",
                error: err.message
            });
        }
    }

    /**
     * 根据ID查询单个工单的异步处理函数
     * 用于获取特定工单的详细信息
     * @param {Express.Request} req - HTTP请求对象，工单ID通过req.params.id获取
     * @param {Express.Response} res - HTTP响应对象，用于返回单个工单数据
     */
    const getOrderById = async (req, res) => {
        try {
            // ==================== 1. 导入MongoDB ObjectId ====================
            const { ObjectId } = require('mongodb');
            
            // ==================== 2. 获取并验证ID参数 ====================
            const id = req.params.id; // 从URL参数中获取工单ID

            // 验证ID是否存在
            if (!id) {
                return res.status(400).json({
                    code: 400,
                    message: "ID 不能为空"
                });
            }

            // ==================== 3. 执行数据库查询 ====================
            // 使用ObjectId将字符串ID转换为MongoDB的ObjectId格式
            const result = await collection.findOne({ _id: new ObjectId(id) });

            // ==================== 4. 检查查询结果 ====================
            if (!result) {
                return res.status(404).json({
                    code: 404,
                    message: "未找到该工单"
                });
            }

            // ==================== 5. 返回成功结果 ====================
            res.status(200).json({
                code: 200,
                message: "工单查询成功",
                data: result  // 返回找到的工单数据
            });

        } catch (err) {
            // ==================== 6. 错误处理 ====================
            // 常见错误：无效的ObjectId格式
            console.error("查询单个工单错误：", err);
            res.status(500).json({
                code: 500,
                message: "服务器查询工单失败",
                error: err.message
            });
        }
    };

    // ==================== 7. 路由注册 ====================
    // 注册多条件查询路由：GET /api/orders
    app.get("/orders", search_fun);
    
    // 注册单个工单查询路由：GET /api/orders/:id
    app.get("/orders/:id", getOrderById);
}