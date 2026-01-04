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
        console.log(`正在连接数据库... URL: ${URL}, DB: ${DB_NAME}, Collection: ${COLLECTION_NAME}`);
        
        // 创建MongoDB客户端实例，添加连接选项
        const client = new MongoClient(URL, {
            serverSelectionTimeoutMS: 10000, // 10秒服务器选择超时
            connectTimeoutMS: 10000,         // 10秒连接超时
            socketTimeoutMS: 45000,          // 45秒socket超时
            maxPoolSize: 10,                 // 最大连接池大小
            minPoolSize: 1,                  // 最小连接池大小
            retryWrites: true,               // 启用重试写入
            retryReads: true                 // 启用重试读取
        });
        
        console.log("MongoClient已创建，开始连接...");
        
        // 异步连接到数据库服务器
        await client.connect();
        console.log("✅ 数据库连接成功！");

        // 选择指定的数据库
        const db = client.db(DB_NAME)
        console.log(`✅ 数据库 "${DB_NAME}" 已选择`);
        
        // 获取指定的集合（相当于表）
        const collection = db.collection(COLLECTION_NAME);
        console.log(`✅ 集合 "${COLLECTION_NAME}" 已获取`);

        // 测试连接是否正常工作
        const stats = await db.stats();
        console.log(`✅ 数据库统计: ${JSON.stringify(stats)}`);

        // 返回数据库对象，以便访问其他集合
        return db
        
    } catch(err){
        // 如果连接失败，打印详细的错误信息
        console.error("❌ 数据库连接失败！");
        console.error(`错误类型: ${err.name}`);
        console.error(`错误消息: ${err.message}`);
        console.error(`错误代码: ${err.code}`);
        console.error(`连接URL: ${URL}`);
        console.error(`完整错误堆栈:`, err);
        
        // 提供诊断建议
        if (err.code === 'ENOTFOUND') {
            console.error("诊断: 无法解析主机名，请检查MongoDB服务是否运行或主机名是否正确");
            console.error("建议: 在Docker环境中，使用服务名 'mongodb' 而不是 'localhost'");
        } else if (err.code === 'ECONNREFUSED') {
            console.error("诊断: 连接被拒绝，MongoDB服务可能未启动或端口不正确");
            console.error("建议: 检查MongoDB容器是否正在运行，端口27017是否开放");
        } else if (err.name === 'MongoServerSelectionError') {
            console.error("诊断: MongoDB服务器选择失败，可能是网络问题或认证问题");
            console.error("建议: 检查网络连接和MongoDB配置");
        }
        
        process.exit(1)  // 退出程序，状态码1表示异常退出
    }
}

// 导出连接函数，供其他模块使用
module.exports = connectDB