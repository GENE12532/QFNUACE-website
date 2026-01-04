<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">电脑维修工单创建</h1>
      <p class="text-lg text-gray-600">填写电脑维修信息并提交工单</p>
    </div>

    <div class="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto" style="background-color: rgba(255,255,255,0.6);">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
                v-model="formData.日期"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：2025.3.5"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">年级学院 *</label>
            <input
                v-model="formData.年级学院"
                @blur="validateGradeCollege"
                @input="clearError('gradeCollege')"
                type="text"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.gradeCollege ? 'border-red-500' : 'border-gray-300'
                }`"
                placeholder="例：23网安"
            >
            <p v-if="errors.gradeCollege" class="mt-1 text-sm text-red-600">
              {{ errors.gradeCollege }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              格式：年级+专业/学院，如：23计算机科学、23网安、24软工
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">被诊者 *</label>
            <input
                v-model="formData.被诊者"
                @blur="validateName"
                @input="clearError('name')"
                type="text"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`"
                placeholder="请输入姓名"
            >
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              支持中文姓名，2-10个字符
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
            <select
                v-model="formData.联系"
                @change="clearError('contact')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="电话">电话</option>
              <option value="微信">微信</option>
              <option value="QQ">QQ</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">号码 *</label>
            <input
                v-model="formData.号码"
                @blur="validateContact"
                @input="clearError('contact')"
                type="text"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`"
                :placeholder="getContactPlaceholder()"
            >
            <p v-if="errors.contact" class="mt-1 text-sm text-red-600">
              {{ errors.contact }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              {{ getContactFormatHint() }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电脑型号 *</label>
            <input
                v-model="formData.电脑型号"
                @blur="validateComputerModel"
                @input="clearError('computerModel')"
                type="text"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.computerModel ? 'border-red-500' : 'border-gray-300'
                }`"
                placeholder="例：戴尔g15_5530 或 ThinkPad X1 Carbon"
            >
            <p v-if="errors.computerModel" class="mt-1 text-sm text-red-600">
              {{ errors.computerModel }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              支持中英文、数字、空格、下划线、连字符，3-50个字符
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">业务 *</label>
            <select
                v-model="formData.业务"
                @change="clearError('service')"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`"
            >
              <option value="">请选择业务类型</option>
              <option value="清灰">清灰</option>
              <option value="重装系统">重装系统</option>
              <option value="硬件维修">硬件维修</option>
              <option value="软件安装">软件安装</option>
              <option value="病毒清理">病毒清理</option>
              <option value="数据恢复">数据恢复</option>
              <option value="其他">其他</option>
            </select>
            <p v-if="errors.service" class="mt-1 text-sm text-red-600">
              {{ errors.service }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">操作人员 *</label>
            <input
                v-model="formData.操作人员"
                @blur="validateOperator"
                @input="clearError('operator')"
                type="text"
                required
                :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.operator ? 'border-red-500' : 'border-gray-300'
                }`"
                placeholder="请输入操作人员姓名"
            >
            <p v-if="errors.operator" class="mt-1 text-sm text-red-600">
              {{ errors.operator }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              支持中文姓名，2-10个字符
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">检察人员</label>
          <input
              v-model="formData.检察人员"
              @blur="validateInspector"
              @input="clearError('inspector')"
              type="text"
              :class="`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.inspector ? 'border-red-500' : 'border-gray-300'
              }`"
              placeholder="例：张长宇、刘沛"
          >
          <p v-if="errors.inspector" class="mt-1 text-sm text-red-600">
            {{ errors.inspector }}
          </p>
          <p v-else class="mt-1 text-xs text-gray-500">
            支持中文姓名，多个姓名用顿号、逗号或空格分隔（可选）
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
              v-model="formData.备注"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入备注信息..."
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            可选，用于补充说明维修详情、注意事项等
          </p>
        </div>

        <div class="flex gap-4 pt-4">
          <button
              type="submit"
              :disabled="isSubmitting || hasErrors"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? '提交中...' : '提交工单' }}
          </button>
        </div>
      </form>

      <div v-if="message" class="mt-4 p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import API_CONFIG from '@/config/api';

// 定义接口
interface FormData {
  日期: string;
  年级学院: string;
  被诊者: string;
  联系: string;
  号码: string;
  电脑型号: string;
  业务: string;
  操作人员: string;
  检察人员: string;
  备注: string;
}

interface Errors {
  gradeCollege: string;
  name: string;
  contact: string;
  computerModel: string;
  service: string;
  operator: string;
  inspector: string;
}

// 表单数据
const formData = reactive<FormData>({
  日期: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
  年级学院: '',
  被诊者: '',
  联系: '电话',
  号码: '',
  电脑型号: '',
  业务: '',
  操作人员: '',
  检察人员: '',
  备注: ''
});

// 错误信息
const errors = reactive<Errors>({
  gradeCollege: '',
  name: '',
  contact: '',
  computerModel: '',
  service: '',
  operator: '',
  inspector: ''
});

// 状态管理
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// 计算属性：是否有错误
const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== '');
});

// 清除错误信息
const clearError = (field: keyof Errors) => {
  errors[field] = '';
};

// 获取联系方式占位符
const getContactPlaceholder = (): string => {
  switch (formData.联系) {
    case '电话':
      return '请输入11位手机号码';
    case 'QQ':
      return '请输入QQ号码';
    case '微信':
      return '请输入微信号';
    default:
      return '请输入联系号码';
  }
};

// 获取联系方式格式提示
const getContactFormatHint = (): string => {
  switch (formData.联系) {
    case '电话':
      return '格式：1开头的11位数字';
    case 'QQ':
      return '格式：5-12位数字，不以0开头';
    case '微信':
      return '格式：6-20位，字母开头，可含字母、数字、_、-';
    default:
      return '';
  }
};

// 验证年级学院
const validateGradeCollege = (): boolean => {
  const gradeCollege = formData.年级学院.trim();

  if (!gradeCollege) {
    errors.gradeCollege = '年级学院不能为空';
    return false;
  }

  // 年级学院验证格式：年级(2位数字) + 专业/学院名称(中文)
  // 示例：23网安、23计算机科学、24软工、25电子工程
  const gradeCollegeRegex = /^([0-9]{2})([\u4e00-\u9fa5]{2,10})$/;

  if (!gradeCollegeRegex.test(gradeCollege)) {
    errors.gradeCollege = '格式不正确，应为：年级(2位数字)+专业/学院(中文名称)，如：23网安、24计算机科学';
    return false;
  }

  // 验证年级：应该是20-29之间的数字（2020-2029年级）
  const grade = parseInt(gradeCollege.substring(0, 2));
  if (grade < 20 || grade > 29) {
    errors.gradeCollege = '年级应在20-29之间（2020-2029年级）';
    return false;
  }

  // 验证专业名称：至少2个中文字符
  const major = gradeCollege.substring(2);
  if (major.length < 2) {
    errors.gradeCollege = '专业/学院名称至少需要2个中文字符';
    return false;
  }

  // 常见的专业/学院名称验证（可选）
  const commonMajors = ['网安', '计算机', '软工', '软件', '电子', '通信', '自动化', '电气', '机械', '土木', '建筑', '经管', '金融', '会计', '外语', '英语', '日语', '法学', '中文', '数学', '物理', '化学', '生物', '医学', '护理', '艺术', '设计', '音乐', '体育'];

  // 检查是否为常见专业（非强制）
  const isCommonMajor = commonMajors.some(majorName => major.includes(majorName));
  if (!isCommonMajor) {
    console.warn(`专业名称 "${major}" 不在常见专业列表中，但仍允许提交`);
  }

  errors.gradeCollege = '';
  return true;
};

// 验证姓名（被诊者）
const validateName = (): boolean => {
  const name = formData.被诊者.trim();

  if (!name) {
    errors.name = '姓名不能为空';
    return false;
  }

  // 中文姓名验证：2-10个字符，支持常见中文姓名
  const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/;

  if (!nameRegex.test(name)) {
    errors.name = '请输入有效的中文姓名，2-10个字符';
    return false;
  }

  errors.name = '';
  return true;
};

// 验证操作人员姓名
const validateOperator = (): boolean => {
  const name = formData.操作人员.trim();

  if (!name) {
    errors.operator = '操作人员不能为空';
    return false;
  }

  // 中文姓名验证
  const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/;

  if (!nameRegex.test(name)) {
    errors.operator = '请输入有效的中文姓名，2-10个字符';
    return false;
  }

  // 可以添加特定操作人员验证（如果需要）
  // 例如：验证是否在允许的操作人员列表中
  const allowedOperators = ['张三', '李四', '王五', '赵六']; // 示例名单
  if (allowedOperators.length > 0 && !allowedOperators.includes(name)) {
    console.warn(`操作人员 "${name}" 不在预设名单中，但仍允许提交`);
  }

  errors.operator = '';
  return true;
};

// 验证检察人员
const validateInspector = (): boolean => {
  const inspectors = formData.检察人员.trim();

  // 检察人员为可选字段，如果为空则通过验证
  if (!inspectors) {
    errors.inspector = '';
    return true;
  }

  // 支持多种分隔符：中文顿号、逗号、空格
  const nameList = inspectors.split(/[、,，\s]+/);

  // 验证每个姓名
  for (let i = 0; i < nameList.length; i++) {
    const name = nameList[i].trim();
    if (name) {
      const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/;
      if (!nameRegex.test(name)) {
        errors.inspector = `第${i + 1}个姓名格式不正确，请输入有效的中文姓名`;
        return false;
      }
    }
  }

  errors.inspector = '';
  return true;
};

// 验证电脑型号
const validateComputerModel = (): boolean => {
  const model = formData.电脑型号.trim();

  if (!model) {
    errors.computerModel = '电脑型号不能为空';
    return false;
  }

  // 电脑型号验证：支持中英文、数字、空格、下划线、连字符
  // 常见格式：品牌 + 型号 + 配置，如：戴尔G15 5530、ThinkPad X1 Carbon
  const modelRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_]{3,50}$/;

  if (!modelRegex.test(model)) {
    errors.computerModel = '电脑型号格式不正确，支持中英文、数字、空格、下划线、连字符，3-50个字符';
    return false;
  }

  // 额外检查：不能全是特殊字符
  const hasValidChar = /[a-zA-Z\u4e00-\u9fa50-9]/.test(model);
  if (!hasValidChar) {
    errors.computerModel = '电脑型号必须包含有效的字母、数字或汉字';
    return false;
  }

  // 常见电脑品牌验证（可选）
  const commonBrands = ['戴尔', 'Dell', '联想', 'Lenovo', 'ThinkPad', '华为', 'Huawei', '苹果', 'Apple', 'MacBook', '惠普', 'HP', '华硕', 'ASUS', '宏碁', 'Acer', '小米', 'Xiaomi', '微软', 'Microsoft', 'Surface'];

  const hasValidBrand = commonBrands.some(brand =>
      model.toLowerCase().includes(brand.toLowerCase()) ||
      brand.toLowerCase().includes(model.substring(0, 2).toLowerCase())
  );

  if (!hasValidBrand) {
    console.warn(`电脑型号 "${model}" 可能不是常见品牌，但仍允许提交`);
  }

  errors.computerModel = '';
  return true;
};

// 验证联系方式
const validateContact = (): boolean => {
  const contactType = formData.联系;
  const contactNumber = formData.号码.trim();

  if (!contactNumber) {
    errors.contact = '联系方式不能为空';
    return false;
  }

  switch (contactType) {
    case '电话':
      // 手机号验证：1开头的11位数字
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(contactNumber)) {
        errors.contact = '手机号格式不正确，请输入11位有效的手机号码';
        return false;
      }
      break;

    case 'QQ':
      // QQ号验证：5-12位数字，不以0开头
      const qqRegex = /^[1-9]\d{4,11}$/;
      if (!qqRegex.test(contactNumber)) {
        errors.contact = 'QQ号格式不正确，请输入5-12位数字，且不能以0开头';
        return false;
      }
      break;

    case '微信':
      // 微信号验证：6-20位字母、数字、下划线或减号，以字母开头
      const wechatRegex = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
      if (!wechatRegex.test(contactNumber)) {
        errors.contact = '微信号格式不正确，请输入6-20位字符，以字母开头，可包含字母、数字、下划线(_)或减号(-)';
        return false;
      }
      break;
  }

  errors.contact = '';
  return true;
};

// 验证业务类型
const validateService = (): boolean => {
  if (!formData.业务) {
    errors.service = '请选择业务类型';
    return false;
  }
  errors.service = '';
  return true;
};

// 表单提交前的全面验证
const validateAllFields = (): boolean => {
  const validations = [
    validateGradeCollege(),
    validateName(),
    validateContact(),
    validateComputerModel(),
    validateService(),
    validateOperator(),
    validateInspector()
  ];

  return validations.every(result => result === true);
};

// 发送到服务器
const sendToServer = async (data: any): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE}`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('数据已保存到服务器:', response.data);
    return {
      success: response.status === 201,
      message: response.data?.message || '工单已成功提交'
    };
  } catch (error: any) {
    console.error('发送到服务器失败:', error);

    if (error.code === 'ECONNREFUSED') {
      return { success: false, message: '无法连接到服务器，请检查服务器是否正在运行' };
    } else if (error.code === 'ENOTFOUND') {
      return { success: false, message: '服务器地址无法访问，请检查网络连接' };
    } else if (error.response?.status === 400) {
      return { success: false, message: '提交的数据格式有误，请检查表单内容' };
    } else if (error.response?.status === 500) {
      return { success: false, message: '服务器内部错误，请稍后重试' };
    } else if (error.code === 'ECONNABORTED') {
      return { success: false, message: '请求超时，请检查网络连接或稍后重试' };
    } else {
      return { success: false, message: `网络错误: ${error.message || '未知错误'}` };
    }
  }
};

// 处理表单提交
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    message.value = '';

    // 全面验证表单
    if (!validateAllFields()) {
      message.value = '表单验证失败，请检查所有带*号的必填项';
      messageType.value = 'error';
      isSubmitting.value = false;
      return;
    }

    // 发送到服务器并获取结果
    const result = await sendToServer(formData);

    if (result.success) {
      message.value = result.message;
      messageType.value = 'success';

      // 清空表单（保留日期）
      const currentDate = formData.日期;
      formData.年级学院 = '';
      formData.被诊者 = '';
      formData.联系 = '电话';
      formData.号码 = '';
      formData.电脑型号 = '';
      formData.业务 = '';
      formData.操作人员 = '';
      formData.检察人员 = '';
      formData.备注 = '';

      // 清空所有错误信息
      Object.keys(errors).forEach(key => {
        errors[key as keyof Errors] = '';
      });
    } else {
      message.value = result.message;
      messageType.value = 'error';
    }

  } catch (error) {
    console.error('处理失败:', error);
    message.value = '处理过程中出现未知错误，请重试';
    messageType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>