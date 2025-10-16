const { MongoClient } = require('mongodb');
 
async function main() {
    // MongoDB 连接 URI
    const uri = "mongodb://localhost:27017"; // 请根据你的 MongoDB 服务器地址进行修改
 
    // 创建一个新的 MongoClient
    const client = new MongoClient(uri);
 
    try {
        // 连接到 MongoDB 服务器
        await client.connect();
 
        console.log("成功连接到服务器");
 
        // 指定数据库
        const database = client.db('runoob');
 
        // 使用 createCollection 方法创建集合
        const collectionName = 'exampleCollection';
        await database.createCollection(collectionName);
        console.log(`集合 ${collectionName} 创建成功`);
 
        // 获取集合
        const collection = database.collection(collectionName);
 
        // 创建多个新文档
        const docs = [
            { name: "Alice", age: 25, address: "Wonderland" },
            { name: "Bob", age: 30, address: "Builderland" },
            { name: "Charlie", age: 35, address: "Chocolate Factory" }
        ];
 
        // 插入多个文档到集合
        const result = await collection.insertMany(docs);
 
        console.log(`${result.insertedCount} 个新文档已创建，ID 为:`);
        Object.keys(result.insertedIds).forEach((id, index) => {
            console.log(`文档 ${index + 1}: ${id}`);
        });
 
        // 查询集合中的所有文档
        const query = {}; // 空查询对象表示查询所有文档
        const options = { projection: { _id: 0, name: 1, age: 1, address: 1 } }; // 仅选择需要的字段
        const cursor = collection.find(query, options);
 
        // 打印查询到的所有文档
        const allValues = await cursor.toArray();
        console.log("查询到的文档:");
        console.log(allValues);
    } finally {
        // 确保在完成后关闭连接
        await client.close();
    }
}
 
main().catch(console.error);

// app.get("/",async (req,res)=>{
//     res.json(await main());
// })

// async function main(){
//     const url = "mongodb://localhost:27017";
//     const client = new MongoClient(url);

//     try{
//         await client.connect();
//         console.log("Database connection successfully!")

//         const db = client.db("Work_order");
//         const collectionname = "order";

//         const collection = db.collection(collectionname);
//         console.log("Collection connection successfully!");

//         const query = {操作人员:"魏凡哲"};
//         const cursor = await collection.find(query)
        
//         const allValues = await cursor.toArray();
//         console.log("查询我的文档：")
//         return allValues;

//     }catch(err){
//         console.log("error:",err)
//         throw err;
//     }
// }

// app.listen(3000,()=>{
//     console.log("server is running!")
// })