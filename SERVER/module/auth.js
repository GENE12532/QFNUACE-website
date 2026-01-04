/**
 * 认证模块
 * 功能：处理用户登录、注册和初始化
 * 路由：POST /api/auth/login
 * 作者：Roo
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_CONFIG, DATABASE_CONFIG } = require('../config');

module.exports = (app, db) => {
    const userCollection = db.collection(DATABASE_CONFIG.USER_COLLECTION_NAME);

    /**
     * 初始化默认管理员账户
     * 如果数据库中没有用户，则创建一个默认管理员
     */
    const initAdmin = async () => {
        try {
            const count = await userCollection.countDocuments();
            if (count === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                
                await userCollection.insertOne({
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin',
                    createdAt: new Date()
                });
                
                // 创建访客账户
                const guestPassword = await bcrypt.hash('guest123', salt);
                await userCollection.insertOne({
                    username: 'guest',
                    password: guestPassword,
                    role: 'guest',
                    createdAt: new Date()
                });

                console.log('✅ 已初始化默认账户: admin/admin123, guest/guest123');
            }
        } catch (err) {
            console.error('初始化管理员账户失败:', err);
        }
    };

    // 启动时尝试初始化
    initAdmin();

    /**
     * 用户登录
     * POST /api/auth/login
     */
    const login = async (req, res) => {
        try {
            const { username, password } = req.body;

            // 1. 验证输入
            if (!username || !password) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名和密码不能为空'
                });
            }

            // 2. 查找用户
            const user = await userCollection.findOne({ username });
            if (!user) {
                return res.status(401).json({
                    code: 401,
                    message: '用户名或密码错误'
                });
            }

            // 3. 验证密码
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    code: 401,
                    message: '用户名或密码错误'
                });
            }

            // 4. 生成 JWT
            const payload = {
                id: user._id,
                username: user.username,
                role: user.role
            };

            const token = jwt.sign(payload, JWT_CONFIG.SECRET, {
                expiresIn: JWT_CONFIG.EXPIRES_IN
            });

            // 5. 返回结果
            res.status(200).json({
                code: 200,
                message: '登录成功',
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        role: user.role
                    }
                }
            });

        } catch (err) {
            console.error('登录错误:', err);
            res.status(500).json({
                code: 500,
                message: '服务器内部错误',
                error: err.message
            });
        }
    };

    // 注册路由
    const router = require('express').Router();
    router.post('/login', login);
    app.use('/auth', router);
};
