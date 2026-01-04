/**
 * 创建工单模块 (Create - CRUD中的C)
 * 功能：处理新工单的创建请求，验证数据并存储到数据库
 * 路由：POST /api/create
 * 作者：学习后端开发
 */

// 导入配置文件
const { APP_CONFIG } = require("../config")
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * 导出创建工单功能模块
 * @param {Express.Router} app - Express路由器对象
 * @param {MongoDB.Collection} collection - MongoDB集合对象，用于数据库操作
 */
module.exports = (app,collection) => {
    
    /**
     * 创建工单的异步处理函数
     * @param {Express.Request} req - HTTP请求对象，包含客户端发送的数据
     * @param {Express.Response} res - HTTP响应对象，用于向客户端发送响应
     */
    const create_fun = async(req,res) => {
        try{
            // ==================== 1. 获取请求数据 ====================
            const newOrderData = req.body; // 从请求体中获取新工单数据

            // ==================== 2. 数据验证 ====================
            // 验证必填字段是否存在，确保数据完整性
            const missingFields = APP_CONFIG.ORDER_FIELDS.REQUIRED_FIELDS.filter(
                field => !newOrderData || !newOrderData[field]
            );
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    code:400,
                    message:`请求数据不完整，缺少必填信息: ${missingFields.join(', ')}`
                });
            }

            // ==================== 3. 构造数据库文档 ====================
            // 使用配置化的工单结构动态构建数据库文档
            const orderToInsert = {};
            
            // 处理普通字段
            APP_CONFIG.ORDER_SCHEMA.FIELDS.forEach(field => {
                const fieldName = field.name;
                
                // 必填字段验证
                if (field.required && (!newOrderData[fieldName] || newOrderData[fieldName].trim() === '')) {
                    throw new Error(`必填字段缺失: ${fieldName}`);
                }
                
                // 设置字段值
                if (newOrderData[fieldName] !== undefined && newOrderData[fieldName] !== null) {
                    // 使用请求数据
                    orderToInsert[fieldName] = newOrderData[fieldName];
                } else if (field.defaultValue !== undefined) {
                    // 使用默认值
                    if (field.defaultValue === 'current_date') {
                        // 当前日期
                        orderToInsert[fieldName] = new Date().toLocaleDateString(APP_CONFIG.DATE_FORMAT.LOCALE, APP_CONFIG.DATE_FORMAT.OPTIONS);
                    } else if (typeof field.defaultValue === 'string' && field.defaultValue.startsWith('DEFAULT_')) {
                        // 引用其他配置项
                        const configKey = field.defaultValue;
                        orderToInsert[fieldName] = APP_CONFIG[configKey];
                    } else {
                        // 普通默认值
                        orderToInsert[fieldName] = field.defaultValue;
                    }
                }
            });
            
            // 处理系统字段
            APP_CONFIG.ORDER_SCHEMA.SYSTEM_FIELDS.forEach(field => {
                const fieldName = field.name;
                
                if (field.defaultValue === 'current_timestamp') {
                    // 当前时间戳
                    orderToInsert[fieldName] = new Date();
                } else if (typeof field.defaultValue === 'string' && field.defaultValue.startsWith('DEFAULT_')) {
                    // 引用其他配置项
                    const configKey = field.defaultValue;
                    orderToInsert[fieldName] = APP_CONFIG[configKey];
                } else {
                    // 普通默认值
                    orderToInsert[fieldName] = field.defaultValue;
                }
            });

            // ==================== 4. 数据库操作 ====================
            // 将新工单插入到MongoDB集合中
            const result = await collection.insertOne(orderToInsert);

            // ==================== 5. 成功响应 ====================
            // 返回创建成功的响应，包含新工单的ID和完整数据
            res.status(201).json({
                code:201,                           // HTTP状态码201表示资源创建成功
                message:"新工单创建成功",
                data:{
                    id:result.insertedId,           // MongoDB自动生成的文档ID
                    order:orderToInsert             // 完整的工单数据
                }
            })
        }catch(err){
            // ==================== 6. 错误处理 ====================
            // 捕获并处理任何可能出现的错误
            console.error("创建工单错误：",err)
            res.status(500).json({
                code:500,                           // HTTP状态码500表示服务器内部错误
                message:"创建工单失败",
                error:err.message                   // 具体的错误信息
            })
        }
    }

    // ==================== 7. 路由注册 ====================
    // 将创建工单的处理函数注册到POST /create路由上
    // 完整路径为：POST /api/create（因为在index.js中挂载了/api前缀）
    // 仅管理员可创建工单
    app.post("/create", verifyToken, checkRole(['admin']), create_fun)
}