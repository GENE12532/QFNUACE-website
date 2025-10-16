module.exports = (app,collection) => {
    const create_fun = async(req,res) => {
        try{
            const newOrderData = req.body;

            // 验证必填字段
            if(!newOrderData || !newOrderData.被诊者 || !newOrderData.号码 || !newOrderData.电脑型号 || !newOrderData.业务){
                return res.status(400).json({
                    code:400,
                    message:"请求数据不完整，缺少必填信息"
                });
            }

            const orderToInsert = {
                日期: newOrderData.日期 || new Date().toLocaleDateString('zh-CN'),
                年级学院: newOrderData.年级学院 || '',
                被诊者: newOrderData.被诊者,
                联系: newOrderData.联系 || '电话',
                号码: newOrderData.号码,
                电脑型号: newOrderData.电脑型号,
                业务: newOrderData.业务,
                操作人员: newOrderData.操作人员 || '',
                检察人员: newOrderData.检察人员 || '',
                备注: newOrderData.备注 || '',
                创建时间: new Date(),
                状态: "待处理"
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

    app.post("/create", create_fun)
}