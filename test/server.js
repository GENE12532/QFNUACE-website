require('dotenv').config(); // 加载 .env 文件
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 中间件：处理 JSON 请求体
app.use(express.json());

// 💡 允许跨域（CORS）
// 由于前后端分离开发，需要设置 CORS，让前端可以访问后端 API
const cors = require('cors');
app.use(cors());

// --- 数据库连接 ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ji-xie-workorder';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 连接成功！');
    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 服务器已启动，监听端口 ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败：', err.message);
  });

// --- 路由引入 (下一步实现) ---
const workorderRoutes = require('./routes/workorders');
app.use('/api/workorders', workorderRoutes);

// 基础测试路由
app.get('/', (req, res) => {
  res.send('计协网站后端 API 运行中！');
});
