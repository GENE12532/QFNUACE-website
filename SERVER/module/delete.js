module.exports = (app, collection) => {
    const delete_fun = async (req, res) => {
        try {
            // 1. 获取 ID
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    code: 400,
                    message: "ID 不能为空"
                });
            }
            
            // 2. 执行数据库操作：deleteOne()（使用简单的字符串ID匹配）
            const result = await collection.deleteOne({
                id: id
            });

            // 3. 检查删除结果
            if (result.deletedCount === 0) {
                return res.status(404).json({ code: 404, message: "未找到要删除的工单" });
            }

            // 4. 返回成功响应
            res.status(200).json({
                code: 200,
                message: `工单 ${id} 删除成功`,
                deletedCount: result.deletedCount
            });

        } catch (err) {
            console.error("删除工单错误:", err);
            res.status(500).json({
                code: 500,
                message: "服务器删除工单失败",
                error: err.message
            });
        }
    }

    app.delete("/api/orders/:id", delete_fun);
}