<!-- Create.vue - 创建工单页面组件 -->
<!-- 功能：提供电脑维修工单创建功能 -->
<!-- 说明：包含完整的工单信息表单，支持创建新的维修工单 -->

<template>
  <div>
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">功能1 - 电脑维修工单创建</h1>
      <p class="text-lg text-gray-600">填写电脑维修信息并提交工单</p>
    </div>

    <!-- 表单容器 -->
    <div class="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto">
      <!-- 工单创建表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息区域 - 两列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 日期输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
                v-model="formData.日期"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例：2025.3.5"
            >
          </div>

          <!-- 年级学院输入 -->
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

        <!-- 联系信息区域 - 两列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 被诊者姓名输入（必填） -->
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

          <!-- 联系方式选择 -->
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

        <!-- 联系号码和设备信息区域 - 两列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 联系号码输入（必填） -->
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

          <!-- 电脑型号输入（必填） -->
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

        <!-- 业务和操作人员区域 - 两列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 业务类型选择（必填） -->
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

          <!-- 操作人员输入 -->
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

        <!-- 检察人员输入 - 单列布局 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">检察人员</label>
          <input
              v-model="formData.检察人员"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：张长宇、刘沛"
          >
        </div>

        <!-- 备注信息输入 - 多行文本 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
              v-model="formData.备注"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入备注信息..."
          ></textarea>
        </div>

        <!-- 提交按钮区域 -->
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

      <!-- 消息提示区域 -->
      <div v-if="message" class="mt-4 p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Create.vue - 创建工单页面的逻辑部分
// 功能：处理工单创建的表单数据、验证和提交
// 说明：包含表单数据管理、API调用和错误处理逻辑

import { ref, reactive } from 'vue';
import axios from 'axios';
import API_CONFIG from '@/config/api';  // 导入API配置

// 定义表单数据接口
interface FormData {
  日期: string;      // 工单日期
  年级学院: string;   // 用户所属年级和学院
  被诊者: string;    // 需要维修的用户姓名
  联系: string;      // 联系方式类型
  号码: string;      // 联系号码
  电脑型号: string;  // 电脑设备型号
  业务: string;      // 维修业务类型
  操作人员: string;  // 执行维修操作的人员
  检察人员: string;  // 检查维修结果的人员
  备注: string;      // 额外备注信息
}

// 响应式表单数据对象
// 说明：使用reactive创建响应式对象，自动更新表单视图
const formData = reactive<FormData>({
  日期: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),  // 默认当前日期
  年级学院: '',
  被诊者: '',
  联系: '电话',  // 默认联系方式为电话
  号码: '',
  电脑型号: '',
  业务: '',
  操作人员: '',
  检察人员: '',
  备注: ''
});

// 状态管理变量
const isSubmitting = ref(false);  // 提交状态，防止重复提交
const message = ref('');          // 操作结果消息
const messageType = ref<'success' | 'error'>('success');  // 消息类型：成功或错误

/**
 * 发送数据到服务器
 * @param data - 要提交的表单数据
 * @returns 包含操作结果的对象
 */
const sendToServer = async (data: any): Promise<{ success: boolean; message: string }> => {
  try {
    // 发送POST请求到创建工单接口
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE}`, data, {
      headers: {
        'Content-Type': 'application/json'  // 设置请求头为JSON格式
      },
      timeout: 10000  // 设置请求超时时间为10秒
    });

    console.log('数据已保存到服务器:', response.data);
    
    // 返回操作结果
    return {
      success: response.status === 201,  // 201表示创建成功
      message: response.data?.message || '工单已成功提交'
    };
  } catch (error: any) {
    console.error('发送到服务器失败:', error);
    
    // 详细的错误处理，提供用户友好的错误信息
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

/**
 * 处理表单提交
 * 说明：验证表单数据并提交到服务器
 */
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;  // 开始提交，禁用提交按钮
    message.value = '';         // 清空之前的消息

    // 发送到服务器并获取结果
    const result = await sendToServer(formData);

    if (result.success) {
      // 提交成功处理
      message.value = result.message;
      messageType.value = 'success';

      // 清空表单（保留日期）
      const currentDate = formData.日期;
      Object.assign(formData, {
        日期: currentDate,  // 保留当前日期
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
      // 提交失败处理
      message.value = result.message;
      messageType.value = 'error';
    }

  } catch (error) {
    // 处理未知错误
    console.error('处理失败:', error);
    message.value = '处理过程中出现未知错误，请重试';
    messageType.value = 'error';
  } finally {
    // 无论成功或失败，都重置提交状态
    isSubmitting.value = false;
  }
};
</script>