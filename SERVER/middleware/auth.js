/**
 * 认证中间件
 * 功能：验证JWT Token，检查用户权限
 * 作者：Roo
 */

const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../config');

/**
 * 验证Token中间件
 * 检查请求头中是否包含有效的Token
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({
            code: 403,
            message: '未提供认证令牌'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            code: 401,
            message: '无效或过期的令牌'
        });
    }
};

/**
 * 角色检查中间件工厂函数
 * @param {Array<string>} roles - 允许的角色列表
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                code: 401,
                message: '未认证的用户'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                code: 403,
                message: '权限不足'
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    checkRole
};
