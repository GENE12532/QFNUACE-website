/**
 * MongoDB 初始化脚本
 * 在容器启动时自动执行，创建数据库和集合
 */

// 切换到 Work_order 数据库
db = db.getSiblingDB('Work_order');

// 创建 order 集合
db.createCollection('order');

// 创建索引以提高查询性能
db.order.createIndex({ "被诊者": 1 });
db.order.createIndex({ "号码": 1 });
db.order.createIndex({ "电脑型号": 1 });
db.order.createIndex({ "业务": 1 });
db.order.createIndex({ "创建时间": -1 });

// 插入示例数据（可选）
db.order.insertMany([
  {
    "日期": "2025.03.05",
    "年级学院": "23网安",
    "被诊者": "孙晓洋",
    "联系": "电话",
    "号码": "17861379375",
    "电脑型号": "戴尔g15_5530",
    "业务": "清灰",
    "操作人员": "魏凡哲",
    "检察人员": "张长宇、刘沛",
    "备注": "反装主板",
    "创建时间": new Date(),
    "更新时间": new Date(),
    "状态": "待处理"
  },
  {
    "日期": "2025.03.06",
    "年级学院": "23计科",
    "被诊者": "李明",
    "联系": "微信",
    "号码": "13912345678",
    "电脑型号": "联想小新",
    "业务": "系统重装",
    "操作人员": "王芳",
    "检察人员": "赵强",
    "备注": "安装Office软件",
    "创建时间": new Date(),
    "更新时间": new Date(),
    "状态": "已完成"
  }
]);

// 打印初始化完成信息
print('✅ MongoDB 数据库初始化完成');
print('✅ 数据库: Work_order');
print('✅ 集合: order');
print('✅ 索引创建完成');
print('✅ 示例数据插入完成');