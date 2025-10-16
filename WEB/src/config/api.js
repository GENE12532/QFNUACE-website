// API配置文件
const API_CONFIG = {
  // 开发环境API地址
  BASE_URL: 'http://localhost:3000/api',
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // API端点
  ENDPOINTS: {
    CREATE: '/create',
    SEARCH: '/orders',  // 修正：搜索使用 /orders 端点
    UPDATE: '/orders',  // PATCH /api/orders/:id
    DELETE: '/orders',  // DELETE /api/orders/:id
    GET_BY_ID: '/orders', // GET /api/orders/:id
    // 为了兼容性添加别名
    GET_ORDER: '/orders', // GET /api/orders/:id (别名)
    UPDATE_ORDER: '/orders' // PATCH /api/orders/:id (别名)
  }
}

export default API_CONFIG