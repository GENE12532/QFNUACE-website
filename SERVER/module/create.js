// create.js
/**
 * 创建工单模块 (Create - CRUD中的C)
 * 功能：处理新工单的创建请求，验证数据并存储到数据库
 * 路由：POST /api/create
 * 作者：学习后端开发
 */

// 导入配置文件
const { APP_CONFIG } = require("../config");

/**
 * 导出创建工单功能模块
 * @param {Express.Router} app - Express路由器对象
 * @param {MongoDB.Collection} collection - MongoDB集合对象，用于数据库操作
 */
module.exports = (app, collection) => {

    // 从配置中获取验证规则
    const VALIDATION_RULES = APP_CONFIG.VALIDATION_CONFIG;

    /**
     * 验证工具函数
     */
    const validationUtils = {
        /**
         * 验证年级学院
         * @param {string} gradeMajor - 年级学院
         * @returns {Object} 验证结果
         */
        validateGradeMajor(gradeMajor) {
            if (!gradeMajor || gradeMajor.trim() === '') {
                return { isValid: true }; // 可选字段
            }

            const trimmed = gradeMajor.trim();

            // 检查长度
            if (trimmed.length < VALIDATION_RULES.GRADE_MAJOR.minLength ||
                trimmed.length > VALIDATION_RULES.GRADE_MAJOR.maxLength) {
                return {
                    isValid: false,
                    message: `年级学院长度必须在${VALIDATION_RULES.GRADE_MAJOR.minLength}-${VALIDATION_RULES.GRADE_MAJOR.maxLength}个字符之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.GRADE_MAJOR.pattern.test(trimmed)) {
                return { isValid: false, message: VALIDATION_RULES.GRADE_MAJOR.message };
            }

            // 验证年级范围（20-29，对应2020-2029级）
            const year = parseInt(trimmed.substring(0, 2));
            if (year < VALIDATION_RULES.GRADE_MAJOR.yearMin ||
                year > VALIDATION_RULES.GRADE_MAJOR.yearMax) {
                return {
                    isValid: false,
                    message: `年级应在${VALIDATION_RULES.GRADE_MAJOR.yearMin}-${VALIDATION_RULES.GRADE_MAJOR.yearMax}之间（2020-2029年级）`
                };
            }

            // 验证专业名称长度
            const major = trimmed.substring(2);
            if (major.length < 2) {
                return { isValid: false, message: "专业/学院名称至少需要2个中文字符" };
            }

            return { isValid: true };
        },

        /**
         * 验证姓名
         * @param {string} name - 姓名
         * @returns {Object} 验证结果
         */
        validateName(name) {
            if (!name || name.trim() === '') {
                return { isValid: false, message: "姓名不能为空" };
            }

            const trimmedName = name.trim();

            // 检查长度
            if (trimmedName.length < VALIDATION_RULES.NAME.minLength ||
                trimmedName.length > VALIDATION_RULES.NAME.maxLength) {
                return {
                    isValid: false,
                    message: `姓名长度必须在${VALIDATION_RULES.NAME.minLength}-${VALIDATION_RULES.NAME.maxLength}个字符之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.NAME.pattern.test(trimmedName)) {
                return { isValid: false, message: VALIDATION_RULES.NAME.message };
            }

            return { isValid: true };
        },

        /**
         * 验证手机号
         * @param {string} phone - 手机号
         * @returns {Object} 验证结果
         */
        validatePhone(phone) {
            if (!phone || phone.trim() === '') {
                return { isValid: false, message: "手机号不能为空" };
            }

            const trimmedPhone = phone.trim();

            // 检查长度
            if (trimmedPhone.length !== VALIDATION_RULES.PHONE.minLength) {
                return {
                    isValid: false,
                    message: `手机号必须是${VALIDATION_RULES.PHONE.minLength}位数字`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.PHONE.pattern.test(trimmedPhone)) {
                return { isValid: false, message: VALIDATION_RULES.PHONE.message };
            }

            return { isValid: true };
        },

        /**
         * 验证QQ号
         * @param {string} qq - QQ号
         * @returns {Object} 验证结果
         */
        validateQQ(qq) {
            if (!qq || qq.trim() === '') {
                return { isValid: false, message: "QQ号不能为空" };
            }

            const trimmedQQ = qq.trim();

            // 检查长度
            if (trimmedQQ.length < VALIDATION_RULES.QQ.minLength ||
                trimmedQQ.length > VALIDATION_RULES.QQ.maxLength) {
                return {
                    isValid: false,
                    message: `QQ号长度必须在${VALIDATION_RULES.QQ.minLength}-${VALIDATION_RULES.QQ.maxLength}位数字之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.QQ.pattern.test(trimmedQQ)) {
                return { isValid: false, message: VALIDATION_RULES.QQ.message };
            }

            return { isValid: true };
        },

        /**
         * 验证微信号
         * @param {string} wechat - 微信号
         * @returns {Object} 验证结果
         */
        validateWechat(wechat) {
            if (!wechat || wechat.trim() === '') {
                return { isValid: false, message: "微信号不能为空" };
            }

            const trimmedWechat = wechat.trim();

            // 检查长度
            if (trimmedWechat.length < VALIDATION_RULES.WECHAT.minLength ||
                trimmedWechat.length > VALIDATION_RULES.WECHAT.maxLength) {
                return {
                    isValid: false,
                    message: `微信号长度必须在${VALIDATION_RULES.WECHAT.minLength}-${VALIDATION_RULES.WECHAT.maxLength}个字符之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.WECHAT.pattern.test(trimmedWechat)) {
                return { isValid: false, message: VALIDATION_RULES.WECHAT.message };
            }

            return { isValid: true };
        },

        /**
         * 根据联系方式类型验证号码
         * @param {string} contactType - 联系方式类型
         * @param {string} contactNumber - 联系号码
         * @returns {Object} 验证结果
         */
        validateContact(contactType, contactNumber) {
            if (!contactType) {
                return { isValid: false, message: "联系方式类型不能为空" };
            }

            if (!VALIDATION_RULES.CONTACT_TYPES.includes(contactType)) {
                return {
                    isValid: false,
                    message: `无效的联系方式类型，可选值：${VALIDATION_RULES.CONTACT_TYPES.join(', ')}`
                };
            }

            if (!contactNumber || contactNumber.trim() === '') {
                return { isValid: false, message: "联系号码不能为空" };
            }

            switch (contactType) {
                case '电话':
                    return this.validatePhone(contactNumber);
                case 'QQ':
                    return this.validateQQ(contactNumber);
                case '微信':
                    return this.validateWechat(contactNumber);
                default:
                    return { isValid: false, message: "未知的联系方式类型" };
            }
        },

        /**
         * 验证电脑型号
         * @param {string} model - 电脑型号
         * @returns {Object} 验证结果
         */
        validateComputerModel(model) {
            if (!model || model.trim() === '') {
                return { isValid: false, message: "电脑型号不能为空" };
            }

            const trimmedModel = model.trim();

            // 检查长度
            if (trimmedModel.length < VALIDATION_RULES.COMPUTER_MODEL.minLength ||
                trimmedModel.length > VALIDATION_RULES.COMPUTER_MODEL.maxLength) {
                return {
                    isValid: false,
                    message: `电脑型号长度必须在${VALIDATION_RULES.COMPUTER_MODEL.minLength}-${VALIDATION_RULES.COMPUTER_MODEL.maxLength}个字符之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.COMPUTER_MODEL.pattern.test(trimmedModel)) {
                return { isValid: false, message: VALIDATION_RULES.COMPUTER_MODEL.message };
            }

            // 检查不能全是特殊字符
            const hasValidChar = /[a-zA-Z\u4e00-\u9fa50-9]/.test(trimmedModel);
            if (!hasValidChar) {
                return { isValid: false, message: "电脑型号必须包含有效的字母、数字或汉字" };
            }

            return { isValid: true };
        },

        /**
         * 验证操作人员姓名
         * @param {string} operator - 操作人员姓名
         * @returns {Object} 验证结果
         */
        validateOperator(operator) {
            if (!operator || operator.trim() === '') {
                return { isValid: false, message: "操作人员不能为空" };
            }

            const trimmedOperator = operator.trim();

            // 检查长度
            if (trimmedOperator.length < VALIDATION_RULES.OPERATOR.minLength ||
                trimmedOperator.length > VALIDATION_RULES.OPERATOR.maxLength) {
                return {
                    isValid: false,
                    message: `操作人员姓名长度必须在${VALIDATION_RULES.OPERATOR.minLength}-${VALIDATION_RULES.OPERATOR.maxLength}个字符之间`
                };
            }

            // 检查格式
            if (!VALIDATION_RULES.OPERATOR.pattern.test(trimmedOperator)) {
                return { isValid: false, message: VALIDATION_RULES.OPERATOR.message };
            }

            return { isValid: true };
        },

        /**
         * 验证业务类型
         * @param {string} businessType - 业务类型
         * @returns {Object} 验证结果
         */
        validateBusinessType(businessType) {
            if (!businessType || businessType.trim() === '') {
                return { isValid: false, message: "业务类型不能为空" };
            }

            const trimmedBusinessType = businessType.trim();

            if (!VALIDATION_RULES.BUSINESS_TYPES.includes(trimmedBusinessType)) {
                return {
                    isValid: false,
                    message: `无效的业务类型，可选值：${VALIDATION_RULES.BUSINESS_TYPES.join(', ')}`
                };
            }

            return { isValid: true };
        },

        /**
         * 验证检察人员
         * @param {string} inspectors - 检察人员，支持多个姓名
         * @returns {Object} 验证结果
         */
        validateInspectors(inspectors) {
            if (!inspectors || inspectors.trim() === '') {
                return { isValid: true }; // 可选字段
            }

            // 支持多种分隔符：中文顿号、逗号、空格
            const nameList = inspectors.split(/[、,，\s]+/).filter(name => name.trim() !== '');

            if (nameList.length === 0) {
                return { isValid: true };
            }

            // 验证每个姓名
            for (let i = 0; i < nameList.length; i++) {
                const name = nameList[i].trim();
                const nameValidation = this.validateName(name);
                if (!nameValidation.isValid) {
                    return {
                        isValid: false,
                        message: `第${i + 1}个检察人员姓名格式不正确：${nameValidation.message}`
                    };
                }
            }

            return { isValid: true };
        },

        /**
         * 验证备注（不做格式限制，只检查长度）
         * @param {string} remark - 备注
         * @returns {Object} 验证结果
         */
        validateRemark(remark) {
            if (!remark || remark.trim() === '') {
                return { isValid: true };
            }

            if (remark.length > 500) { // 限制500字符
                return { isValid: false, message: "备注内容不能超过500个字符" };
            }

            return { isValid: true };
        }
    };

    /**
     * 创建工单的异步处理函数
     * @param {Express.Request} req - HTTP请求对象，包含客户端发送的数据
     * @param {Express.Response} res - HTTP响应对象，用于向客户端发送响应
     */
    const create_fun = async (req, res) => {
        try {
            // ==================== 1. 获取请求数据 ====================
            const newOrderData = req.body;

            // ==================== 2. 基本数据验证 ====================
            if (!newOrderData || typeof newOrderData !== 'object') {
                return res.status(400).json({
                    code: 400,
                    message: "请求数据格式错误，必须是JSON对象"
                });
            }

            // ==================== 3. 详细字段验证 ====================
            const validationErrors = [];

            // 验证年级学院（可选）
            if (newOrderData.年级学院) {
                const gradeValidation = validationUtils.validateGradeMajor(newOrderData.年级学院);
                if (!gradeValidation.isValid) {
                    validationErrors.push(`年级学院：${gradeValidation.message}`);
                }
            }

            // 验证姓名（被诊者）
            if (!newOrderData.被诊者) {
                validationErrors.push("被诊者姓名：不能为空");
            } else {
                const nameValidation = validationUtils.validateName(newOrderData.被诊者);
                if (!nameValidation.isValid) {
                    validationErrors.push(`被诊者姓名：${nameValidation.message}`);
                }
            }

            // 验证联系方式
            if (!newOrderData.联系) {
                validationErrors.push("联系方式类型：不能为空");
            } else if (!newOrderData.号码) {
                validationErrors.push("联系号码：不能为空");
            } else {
                const contactValidation = validationUtils.validateContact(newOrderData.联系, newOrderData.号码);
                if (!contactValidation.isValid) {
                    validationErrors.push(`联系方式：${contactValidation.message}`);
                }
            }

            // 验证电脑型号
            if (!newOrderData.电脑型号) {
                validationErrors.push("电脑型号：不能为空");
            } else {
                const modelValidation = validationUtils.validateComputerModel(newOrderData.电脑型号);
                if (!modelValidation.isValid) {
                    validationErrors.push(`电脑型号：${modelValidation.message}`);
                }
            }

            // 验证业务类型
            if (!newOrderData.业务) {
                validationErrors.push("业务类型：不能为空");
            } else {
                const businessValidation = validationUtils.validateBusinessType(newOrderData.业务);
                if (!businessValidation.isValid) {
                    validationErrors.push(`业务类型：${businessValidation.message}`);
                }
            }

            // 验证操作人员
            if (!newOrderData.操作人员) {
                validationErrors.push("操作人员：不能为空");
            } else {
                const operatorValidation = validationUtils.validateOperator(newOrderData.操作人员);
                if (!operatorValidation.isValid) {
                    validationErrors.push(`操作人员：${operatorValidation.message}`);
                }
            }

            // 验证检察人员（可选）
            if (newOrderData.检察人员) {
                const inspectorValidation = validationUtils.validateInspectors(newOrderData.检察人员);
                if (!inspectorValidation.isValid) {
                    validationErrors.push(`检察人员：${inspectorValidation.message}`);
                }
            }

            // 验证备注（可选）
            if (newOrderData.备注) {
                const remarkValidation = validationUtils.validateRemark(newOrderData.备注);
                if (!remarkValidation.isValid) {
                    validationErrors.push(`备注：${remarkValidation.message}`);
                }
            }

            // 如果有验证错误，返回错误信息
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    code: 400,
                    message: "数据验证失败",
                    errors: validationErrors
                });
            }

            // ==================== 4. 构造数据库文档 ====================
            const orderToInsert = {
                日期: newOrderData.日期 || new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
                年级学院: newOrderData.年级学院 ? newOrderData.年级学院.trim() : '',
                被诊者: newOrderData.被诊者.trim(),
                联系: newOrderData.联系.trim(),
                号码: newOrderData.号码.trim(),
                电脑型号: newOrderData.电脑型号.trim(),
                业务: newOrderData.业务.trim(),
                操作人员: newOrderData.操作人员.trim(),
                检察人员: newOrderData.检察人员 ? newOrderData.检察人员.trim() : '',
                备注: newOrderData.备注 ? newOrderData.备注.trim() : '',
                created_at: new Date(),
                updated_at: new Date()
            };

            // ==================== 5. 数据库操作 ====================
            const result = await collection.insertOne(orderToInsert);

            // ==================== 6. 成功响应 ====================
            res.status(201).json({
                code: 201,
                message: "新工单创建成功",
                data: {
                    id: result.insertedId,
                    order: orderToInsert
                }
            });

        } catch (err) {
            // ==================== 7. 错误处理 ====================
            console.error("创建工单错误：", err);

            if (err.code === 11000) {
                res.status(409).json({
                    code: 409,
                    message: "工单已存在或数据重复",
                    error: err.message
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: "创建工单失败",
                    error: err.message
                });
            }
        }
    }

    // ==================== 8. 路由注册 ====================
    app.post("/create", create_fun);
};