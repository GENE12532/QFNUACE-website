const { ObjectId } = require('mongodb');

module.exports = (app, collection) => {
    const patch_fun = async (req, res) => {
        try {
            const id = req.params.id;
            const updateData = req.body;

            // 验证更新数据
            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    code: 400,
                    message: "更新数据不能为空"
                });
            }

            // 查找并更新记录（使用MongoDB ObjectId）
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...updateData,
                        更新时间: new Date()
                    }
                }
            );

            if(result.matchedCount === 0) {
                return res.status(404).json({
                    code:404,
                    message:"未找到该工单"
                });
            }

            res.status(200).json({
                code: 200,
                message: `工单 ${id} 更新成功`,
                modifiedCount: result.modifiedCount
            });

        }catch (err) {
            console.error("更新工单错误:", err);
            res.status(500).json({
                code: 500,
                message: "服务器更新工单失败",
                error: err.message
            });
        }
    }

    app.patch("/orders/:id", patch_fun)
}