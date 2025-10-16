const express = require("express")
const cors = require("cors")

const create_fun = require("./module/create");
const search_fun = require("./module/search");
const patch_fun = require("./module/patch")
const delete_fun = require("./module/delete")
const connectDB = require("./back")

const app = express()
const PORT = 3000;

// CORS配置 - 允许前端访问
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://10.22.12.186:5173'], // Vite默认端口
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

async function startServer(){
    let collection;
    try{
        collection = await connectDB();

        // 为所有路由添加 /api 前缀
        const apiRouter = express.Router();
        
        create_fun(apiRouter,collection);
        search_fun(apiRouter,collection);
        delete_fun(apiRouter,collection);
        patch_fun(apiRouter,collection);
        
        app.use('/api', apiRouter);

        app.listen(PORT,() => {
            console.log(`服务器已成功启动，监听端口: ${PORT}`)
        })
    }catch(err){
        console.log("错误：",err);
        process.exit(1);
    }
}

startServer();