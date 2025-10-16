module.exports = (app, collection) => {
    const search_fun = async (req, res) => {
        try {
            // 构建查询条件
            const query = {};
            
            // 支持按被诊者、号码、电脑型号、业务等字段搜索
            if (req.query.被诊者) {
                query.被诊者 = { $regex: req.query.被诊者, $options: 'i' };
            }
            if (req.query.号码) {
                query.号码 = { $regex: req.query.号码, $options: 'i' };
            }
            if (req.query.电脑型号) {
                query.电脑型号 = { $regex: req.query.电脑型号, $options: 'i' };
            }
            if (req.query.业务) {
                query.业务 = { $regex: req.query.业务, $options: 'i' };
            }
            if (req.query.年级学院) {
                query.年级学院 = { $regex: req.query.年级学院, $options: 'i' };
            }
            if (req.query.操作人员) {
                query.操作人员 = { $regex: req.query.操作人员, $options: 'i' };
            }

            console.log('查询条件:', query);

            // 执行查询，按创建时间倒序排列
            const results = await collection.find(query).sort({ 创建时间: -1 }).toArray();

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

    // 获取单个工单的函数
    const getOrderById = async (req, res) => {
        try {
            const { ObjectId } = require('mongodb');
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    code: 400,
                    message: "ID 不能为空"
                });
            }

            const result = await collection.findOne({ _id: new ObjectId(id) });

            if (!result) {
                return res.status(404).json({
                    code: 404,
                    message: "未找到该工单"
                });
            }

            res.status(200).json({
                code: 200,
                message: "工单查询成功",
                data: result
            });

        } catch (err) {
            console.error("查询单个工单错误：", err);
            res.status(500).json({
                code: 500,
                message: "服务器查询工单失败",
                error: err.message
            });
        }
    };

    app.get("/orders", search_fun);
    app.get("/orders/:id", getOrderById);
}