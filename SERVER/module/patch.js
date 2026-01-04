/**
 * 更新工单模块 (Update - CRUD中的U)
 * 功能：处理工单的更新请求，支持部分字段更新
 * 路由：PATCH /api/orders/:id
 * 作者：学习后端开发
 */

// 导入MongoDB的ObjectId类，用于处理MongoDB文档的唯一标识符
const { ObjectId } = require('mongodb');
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * 导出更新工单功能模块
 * @param {Express.Router} app - Express路由器对象
 * @param {MongoDB.Collection} collection - MongoDB集合对象，用于数据库操作
 */
module.exports = (app, collection) => {
    
    /**
     * 更新工单的异步处理函数
     * 使用PATCH方法支持部分更新，只更新客户端提供的字段
     * @param {Express.Request} req - HTTP请求对象，包含要更新的工单ID和数据
     * @param {Express.Response} res - HTTP响应对象，用于返回更新结果
     */
    const patch_fun = async (req, res) => {
        try {
            // ==================== 1. 获取请求参数 ====================
            const id = req.params.id;        // 从URL参数中获取工单ID
            const updateData = req.body;      // 从请求体中获取要更新的数据

            // ==================== 2. 数据验证 ====================
            // 验证更新数据是否存在且不为空对象
            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    code: 400,
                    message: "更新数据不能为空"
                });
            }

            // ==================== 3. 执行数据库更新操作 ====================
            // 使用updateOne方法更新单个文档
            const result = await collection.updateOne(
                // 查询条件：根据ObjectId查找要更新的工单
                { _id: new ObjectId(id) },
                {
                    // 使用$set操作符更新指定字段
                    $set: {
                        ...updateData,              // 展开客户端提供的更新数据
                        更新时间: new Date()        // 自动添加更新时间戳
                    }
                }
            );

            // ==================== 4. 检查更新结果 ====================
            // matchedCount表示匹配到的文档数量，为0说明没找到对应的工单
            if(result.matchedCount === 0) {
                return res.status(404).json({
                    code:404,
                    message:"未找到该工单"
                });
            }

            // ==================== 5. 返回成功响应 ====================
            res.status(200).json({
                code: 200,
                message: `工单 ${id} 更新成功`,
                modifiedCount: result.modifiedCount  // 实际被修改的文档数量
            });

        }catch (err) {
            // ==================== 6. 错误处理 ====================
            // 捕获并处理更新过程中的任何错误
            // 常见错误：无效的ObjectId格式、数据库连接问题等
            console.error("更新工单错误:", err);
            res.status(500).json({
                code: 500,
                message: "服务器更新工单失败",
                error: err.message
            });
        }
    }

    // ==================== 7. 路由注册 ====================
    // 将更新工单的处理函数注册到PATCH /orders/:id路由上
    // 完整路径为：PATCH /api/orders/:id（因为在index.js中挂载了/api前缀）
    // PATCH方法适用于部分更新，与PUT（完全替换）不同
    // 仅管理员可更新工单
    app.patch("/orders/:id", verifyToken, checkRole(['admin']), patch_fun)
}