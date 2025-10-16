const {MongoClient} = require("mongodb")
const URL = "mongodb://localhost:27017";
const DB_NAME = "Work_order";
const COLLECTION_NAME = "order";


const connectDB = async () => {
    try{
        const client = new MongoClient(URL)
        await client.connect();
        console.log("数据库已连接...")

        const db = client.db(DB_NAME)
        collection = db.collection(COLLECTION_NAME);

        return collection
        
    } catch(err){
        console.log("数据库连接失败：",err)
        process.exit(1)
    }
}

module.exports = connectDB