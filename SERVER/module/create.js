/**
 * 创建工单模块 (Create - CRUD中的C)
 * 功能：处理新工单的创建请求，验证数据并存储到数据库
 * 路由：POST /api/create
 * 作者：学习后端开发
 */

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
            if(!newOrderData || !newOrderData.被诊者 || !newOrderData.号码 || !newOrderData.电脑型号 || !newOrderData.业务){
                return res.status(400).json({
                    code:400,
                    message:"请求数据不完整，缺少必填信息"
                });
            }

            // ==================== 3. 构造数据库文档 ====================
            // 创建要插入数据库的工单对象，包含默认值处理
            const orderToInsert = {
                日期: newOrderData.日期 || new Date().toLocaleDateString('zh-CN'),  // 如果没有提供日期，使用当前日期
                年级学院: newOrderData.年级学院 || '',                              // 可选字段，默认为空字符串
                被诊者: newOrderData.被诊者,                                       // 必填：需要服务的人员姓名
                联系: newOrderData.联系 || '电话',                                 // 联系方式，默认为"电话"
                号码: newOrderData.号码,                                           // 必填：联系电话号码
                电脑型号: newOrderData.电脑型号,                                   // 必填：需要维修的电脑型号
                业务: newOrderData.业务,                                           // 必填：具体的服务类型
                操作人员: newOrderData.操作人员 || '',                             // 可选：负责处理的技术人员
                检察人员: newOrderData.检察人员 || '',                             // 可选：质检人员
                备注: newOrderData.备注 || '',                                     // 可选：额外说明信息
                创建时间: new Date(),                                              // 系统自动生成的创建时间戳
                状态: "待处理"                                                     // 新工单默认状态为"待处理"
            };

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
    app.post("/create", create_fun)
}