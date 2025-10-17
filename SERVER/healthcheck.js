/**
 * 健康检查脚本
 * 用于Docker容器健康检查
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ 健康检查通过');
    process.exit(0);
  } else {
    console.log(`❌ 健康检查失败，状态码: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log(`❌ 健康检查错误: ${err.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ 健康检查超时');
  req.destroy();
  process.exit(1);
});

req.end();