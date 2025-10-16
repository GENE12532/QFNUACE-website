/**
 * 删除工单模块 (Delete - CRUD中的D)
 * 功能：处理工单的删除请求，根据ID永久删除指定工单
 * 路由：DELETE /api/orders/:id
 * 作者：学习后端开发
 */

// 导入MongoDB的ObjectId类，用于处理MongoDB文档的唯一标识符
const { ObjectId } = require('mongodb');

/**
 * 导出删除工单功能模块
 * @param {Express.Router} app - Express路由器对象
 * @param {MongoDB.Collection} collection - MongoDB集合对象，用于数据库操作
 */
module.exports = (app, collection) => {
    
    /**
     * 删除工单的异步处理函数
     * 根据工单ID永久删除数据库中的工单记录
     * @param {Express.Request} req - HTTP请求对象，包含要删除的工单ID
     * @param {Express.Response} res - HTTP响应对象，用于返回删除结果
     */
    const delete_fun = async (req, res) => {
        try {
            // ==================== 1. 获取并验证ID参数 ====================
            const id = req.params.id; // 从URL参数中获取要删除的工单ID

            // 验证ID是否存在
            if (!id) {
                return res.status(400).json({
                    code: 400,
                    message: "ID 不能为空"
                });
            }
            
            // ==================== 2. 执行数据库删除操作 ====================
            // 使用deleteOne方法删除单个文档
            // 注意：这是永久删除操作，无法撤销
            const result = await collection.deleteOne({
                _id: new ObjectId(id)  // 将字符串ID转换为MongoDB的ObjectId格式
            });

            // ==================== 3. 检查删除结果 ====================
            // deletedCount表示实际删除的文档数量
            // 如果为0，说明没有找到匹配的工单
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "未找到要删除的工单"
                });
            }

            // ==================== 4. 返回成功响应 ====================
            res.status(200).json({
                code: 200,
                message: `工单 ${id} 删除成功`,
                deletedCount: result.deletedCount  // 返回删除的文档数量（通常为1）
            });

        } catch (err) {
            // ==================== 5. 错误处理 ====================
            // 捕获并处理删除过程中的任何错误
            // 常见错误：无效的ObjectId格式、数据库连接问题等
            console.error("删除工单错误:", err);
            res.status(500).json({
                code: 500,
                message: "服务器删除工单失败",
                error: err.message
            });
        }
    }

    // ==================== 6. 路由注册 ====================
    // 将删除工单的处理函数注册到DELETE /orders/:id路由上
    // 完整路径为：DELETE /api/orders/:id（因为在index.js中挂载了/api前缀）
    // DELETE方法专门用于删除资源
    app.delete("/orders/:id", delete_fun);
}