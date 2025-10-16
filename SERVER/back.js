/**
 * 数据库连接模块
 * 功能：建立与MongoDB数据库的连接，并返回集合对象供其他模块使用
 * 作者：学习后端开发
 */

// 从mongodb包中导入MongoClient类，用于连接MongoDB数据库
const {MongoClient} = require("mongodb")

// 导入配置文件
const { DATABASE_CONFIG } = require("./config")

// 数据库连接配置（从配置文件读取）
const URL = DATABASE_CONFIG.URL;          // MongoDB数据库地址
const DB_NAME = DATABASE_CONFIG.DB_NAME;  // 数据库名称，存储工单相关数据
const COLLECTION_NAME = DATABASE_CONFIG.COLLECTION_NAME; // 集合名称，类似于关系型数据库中的表

/**
 * 连接数据库的异步函数
 * @returns {Promise<Collection>} 返回MongoDB集合对象，用于后续的数据库操作
 */
const connectDB = async () => {
    try{
        // 创建MongoDB客户端实例
        const client = new MongoClient(URL)
        
        // 异步连接到数据库服务器
        await client.connect();
        console.log("数据库已连接...")

        // 选择指定的数据库
        const db = client.db(DB_NAME)
        
        // 获取指定的集合（相当于表）
        collection = db.collection(COLLECTION_NAME);

        // 返回集合对象，供其他模块进行增删改查操作
        return collection
        
    } catch(err){
        // 如果连接失败，打印错误信息并退出程序
        console.log("数据库连接失败：",err)
        process.exit(1)  // 退出程序，状态码1表示异常退出
    }
}

// 导出连接函数，供其他模块使用
module.exports = connectDB