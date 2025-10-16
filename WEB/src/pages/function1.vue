<!-- src/pages/function1.vue -->
<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">功能1 - 数据收集表单</h1>
      <p class="text-lg text-gray-600">填写信息并生成JSON文件</p>
    </div>

    <div class="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
            <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邮箱"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">电话</label>
          <input
              v-model="formData.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入电话号码"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">需求描述 *</label>
          <textarea
              v-model="formData.requirements"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请详细描述您的需求..."
          ></textarea>
        </div>

        <div class="flex gap-4 pt-4">
          <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? '处理中...' : '生成并发送JSON文件' }}
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
  name: string;
  email: string;
  phone: string;
  requirements: string;
}

// 表单数据
const formData = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  requirements: ''
});

// 状态管理
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// 生成最终的数据结构
const generateFinalData = () => {
  return {
    basicInfo: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    },
    requirements: formData.requirements,
    submittedAt: new Date().toISOString()
  };
};

// 发送到服务器
const sendToServer = async (data: any): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(API_CONFIG.ENDPOINTS.CREATE, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('数据已保存到服务器:', response.data);
    return {
      success: response.status === 201,
      message: response.data?.message || '数据已成功保存到服务器'
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

    // 生成最终数据
    const finalData = generateFinalData();

    // 发送到服务器并获取结果
    const result = await sendToServer(finalData);

    if (result.success) {
      message.value = result.message;
      messageType.value = 'success';

      // 清空表单
      Object.assign(formData, {
        name: '',
        email: '',
        phone: '',
        requirements: ''
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