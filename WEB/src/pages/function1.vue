<!-- src/pages/function1.vue -->
<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">功能1 - 电脑维修工单创建</h1>
      <p class="text-lg text-gray-600">填写电脑维修信息并提交工单</p>
    </div>

    <div class="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">年级学院</label>
            <input
                v-model="formData.年级学院"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：23网安"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">被诊者 *</label>
            <input
                v-model="formData.被诊者"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
            <select
                v-model="formData.联系"
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
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入联系号码"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电脑型号 *</label>
            <input
                v-model="formData.电脑型号"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：戴尔g15_5530"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">业务 *</label>
            <select
                v-model="formData.业务"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">操作人员</label>
            <input
                v-model="formData.操作人员"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入操作人员姓名"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">检察人员</label>
          <input
              v-model="formData.检察人员"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：张长宇、刘沛"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
              v-model="formData.备注"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入备注信息..."
          ></textarea>
        </div>

        <div class="flex gap-4 pt-4">
          <button
              type="submit"
              :disabled="isSubmitting"
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
import { ref, reactive } from 'vue';
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

// 状态管理
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

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
    
    // 详细的错误处理
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

    // 发送到服务器并获取结果
    const result = await sendToServer(formData);

    if (result.success) {
      message.value = result.message;
      messageType.value = 'success';

      // 清空表单（保留日期）
      const currentDate = formData.日期;
      Object.assign(formData, {
        日期: currentDate,
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