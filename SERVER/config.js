/**
 * 服务器配置文件
 * 功能：统一管理所有配置信息，便于维护和环境切换
 * 作者：学习后端开发
 */

// ==================== 数据库配置 ====================
const DATABASE_CONFIG = {
    // MongoDB连接URL
    URL: process.env.MONGODB_URL || "mongodb://localhost:27017",
    
    // 数据库名称
    DB_NAME: process.env.DB_NAME || "Work_order",
    
    // 集合名称（相当于表名）
    COLLECTION_NAME: process.env.COLLECTION_NAME || "order"
};

// ==================== 服务器配置 ====================
const SERVER_CONFIG = {
    // 服务器端口号
    PORT: process.env.SERVER_PORT || 3000,
    
    // CORS跨域配置
    CORS: {
        // 允许的前端地址
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173'],
        
        // 允许的HTTP方法
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        
        // 允许的请求头
        allowedHeaders: ['Content-Type', 'Authorization'],
        
        // 是否允许携带凭证（如cookies）
        credentials: true
    }
};

// ==================== 应用配置 ====================
const APP_CONFIG = {
    // API路由前缀
    API_PREFIX: '/api',
    
    // 默认工单状态
    DEFAULT_ORDER_STATUS: "待处理",
    
    // 默认联系方式
    DEFAULT_CONTACT_METHOD: "QQ",
    
    // 日期格式配置
    DATE_FORMAT: {
        LOCALE: 'zh-CN',
        OPTIONS: { year: 'numeric', month: '2-digit', day: '2-digit' }
    },
    
    // 工单文档结构配置 - 完整配置化
    ORDER_SCHEMA: {
        // 字段定义（按显示顺序）
        FIELDS: [
            {
                name: '日期',
                type: 'date',
                required: false,
                defaultValue: 'current_date'
            },
            {
                name: '年级学院',
                type: 'string',
                required: false,
                defaultValue: ''
            },
            {
                name: '被诊者',
                type: 'string',
                required: true
            },
            {
                name: '联系',
                type: 'string',
                required: false,
                defaultValue: 'DEFAULT_CONTACT_METHOD'
            },
            {
                name: '号码',
                type: 'string',
                required: true
            },
            {
                name: '电脑型号',
                type: 'string',
                required: true
            },
            {
                name: '业务',
                type: 'string',
                required: true
            },
            {
                name: '操作人员',
                type: 'string',
                required: false,
                defaultValue: ''
            },
            {
                name: '检察人员',
                type: 'string',
                required: false,
                defaultValue: ''
            },
            {
                name: '备注',
                type: 'string',
                required: false,
                defaultValue: ''
            }
        ],
        
        // 系统自动生成的字段
        SYSTEM_FIELDS: [
            {
                name: '创建时间',
                type: 'timestamp',
                defaultValue: 'current_timestamp'
            },
            {
                name: '状态',
                type: 'string',
                defaultValue: 'DEFAULT_ORDER_STATUS'
            }
        ]
    },
    
    // 工单字段配置（向后兼容）
    ORDER_FIELDS: {
        // 必填字段
        REQUIRED_FIELDS: ['被诊者', '号码', '电脑型号', '业务'],
        
        // 可选字段
        OPTIONAL_FIELDS: ['日期', '年级学院', '联系', '操作人员', '检察人员', '备注']
    },
    
    // 搜索字段配置
    SEARCH_FIELDS: ['被诊者', '号码', '电脑型号', '业务', '年级学院', '操作人员']
};

// ==================== 导出配置 ====================
module.exports = {
    DATABASE_CONFIG,
    SERVER_CONFIG,
    APP_CONFIG
};