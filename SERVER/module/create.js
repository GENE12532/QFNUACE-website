module.exports = (app,collection) => {
    const create_fun = async(req,res) => {
        try{
            const newOrderData = req.body;

            if(!newOrderData || !newOrderData.basicInfo || !newOrderData.requirements){
                return res.status(400).json({
                    code:400,
                    message:"请求数据不完整，缺少基本信息或需求描述"
                });
            }

            // 验证基本信息的完整性
            if(!newOrderData.basicInfo.name || !newOrderData.basicInfo.email || !newOrderData.basicInfo.phone){
                return res.status(400).json({
                    code:400,
                    message:"基本信息不完整，请填写姓名、邮箱和电话"
                });
            }

            const orderToInsert = {
                id: require('crypto').randomBytes(2).toString('hex'), // 生成简短ID
                basicInfo: newOrderData.basicInfo,
                requirements: newOrderData.requirements,
                submittedAt: new Date(),
                status: "待处理",
                isDeleted: false
            };

            const result = await collection.insertOne(orderToInsert);

            res.status(201).json({
                code:201,
                message:"新工单创建成功",
                data:{
                    id:result.insertedId,
                    order:orderToInsert
                }
            })
        }catch(err){
            console.error("创建工单错误：",err)
            res.status(500).json({
                code:500,
                message:"创建工单失败",
                error:err.message
            })
        }
    }

    app.post("/api/create", create_fun)
}