module.exports = (app, collection) => {
    const search_fun = async (req, res) => {
        try {
            // 构建查询条件
            const query = {};
            
            // 支持按名称、邮箱、电话等字段搜索
            if (req.query.name) {
                query['basicInfo.name'] = { $regex: req.query.name, $options: 'i' };
            }
            if (req.query.email) {
                query['basicInfo.email'] = { $regex: req.query.email, $options: 'i' };
            }
            if (req.query.phone) {
                query['basicInfo.phone'] = { $regex: req.query.phone, $options: 'i' };
            }
            if (req.query.requirements) {
                query.requirements = { $regex: req.query.requirements, $options: 'i' };
            }

            console.log('查询条件:', query);

            // 执行查询，按提交时间倒序排列
            const results = await collection.find(query).sort({ submittedAt: -1 }).toArray();

            res.status(200).json({
                code: 200,
                message: `成功查询到 ${results.length} 条工单`,
                data: results
            });

        } catch (err) {
            console.error("查询工单错误：", err);

            res.status(500).json({
                code: 500,
                message: "服务器查询工单失败",
                error: err.message
            });
        }
    }

    app.get("/api/orders", search_fun);
}