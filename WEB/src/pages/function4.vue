
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import API_CONFIG from '@/config/api.js'

// 定义接口类型
interface BasicInfo {
  name: string
  email: string
  phone: string
}

interface SearchResult {
  id: string
  basicInfo: BasicInfo
  requirements: string
  submittedAt: string
  updatedAt?: string
}

// 响应式数据
const searchId = ref('')
const isSearching = ref(false)
const isDeleting = ref(false)
const orderFound = ref(false)
const orderData = ref<SearchResult | null>(null)

// 搜索工单
const searchOrder = async () => {
  if (!searchId.value.trim()) {
    ElMessage.warning('请输入工单ID')
    return
  }

  isSearching.value = true
  orderFound.value = false
  orderData.value = null

  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ORDER}/${searchId.value.trim()}`)
    
    if (response.data.code === 200 && response.data.data) {
      orderData.value = response.data.data
      orderFound.value = true
      ElMessage.success('工单查找成功')
    } else {
      ElMessage.error('未找到该工单')
      resetSearch()
    }
  } catch (error: any) {
    console.error('搜索工单失败:', error)
    
    if (error.response?.status === 404) {
      ElMessage.error('未找到该工单')
    } else if (error.response?.status === 400) {
      ElMessage.error('请求参数错误')
    } else if (error.code === 'ECONNREFUSED') {
      ElMessage.error('无法连接到服务器，请检查网络连接')
    } else {
      ElMessage.error(`搜索失败: ${error.response?.data?.message || error.message || '未知错误'}`)
    }
    
    resetSearch()
  } finally {
    isSearching.value = false
  }
}

// 删除工单
const deleteOrder = async () => {
  if (!orderData.value) {
    ElMessage.warning('请先搜索要删除的工单')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除工单 "${orderData.value.id}" 吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: false
      }
    )
  } catch {
    return // 用户取消
  }

  isDeleting.value = true

  try {
    const response = await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE}/${orderData.value.id}`)

    if (response.data.code === 200) {
      ElMessage.success('工单删除成功！')
      resetSearch()
    } else {
      ElMessage.error(`删除失败: ${response.data.message || '未知错误'}`)
    }
  } catch (error: any) {
    console.error('删除工单失败:', error)
    
    if (error.response?.status === 404) {
      ElMessage.error('工单不存在，可能已被删除')
      resetSearch()
    } else if (error.response?.status === 400) {
      ElMessage.error(`请求参数错误: ${error.response.data?.message || ''}`)
    } else if (error.code === 'ECONNREFUSED') {
      ElMessage.error('无法连接到服务器，请检查网络连接')
    } else {
      ElMessage.error(`删除失败: ${error.response?.data?.message || error.message || '未知错误'}`)
    }
  } finally {
    isDeleting.value = false
  }
}

// 重置搜索
const resetSearch = () => {
  searchId.value = ''
  orderFound.value = false
  orderData.value = null
}

// 键盘事件处理
const handleSearchKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    searchOrder()
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>

<template>
  <div class="function4-container">
    <div class="page-header">
      <h1 class="page-title">删除工单</h1>
      <p class="page-description">搜索并删除指定工单（此操作不可恢复）</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card class="search-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">搜索工单</span>
          </div>
        </template>
        
        <div class="search-form">
          <el-input
            v-model="searchId"
            placeholder="请输入工单ID"
            class="search-input"
            :disabled="isSearching || isDeleting"
            @keyup="handleSearchKeyup"
            clearable
          >
            <template #prepend>工单ID</template>
          </el-input>
          
          <div class="search-buttons">
            <el-button 
              type="primary" 
              @click="searchOrder"
              :loading="isSearching"
              :disabled="!searchId.trim() || isDeleting"
            >
              🔍 {{ isSearching ? '搜索中...' : '搜索工单' }}
            </el-button>
            
            <el-button
              @click="resetSearch"
              :disabled="isSearching || isDeleting"
            >
              🔄 重置
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 工单详情区域 -->
    <div v-if="orderFound && orderData" class="order-details-section">
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">工单详情</span>
            <el-tag type="danger" size="large">
              ⚠️ 待删除
            </el-tag>
          </div>
        </template>
        
        <div class="order-info">
          <div class="info-section">
            <h3 class="section-title">基本信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">工单ID：</label>
                <span class="info-value">{{ orderData.id }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">姓名：</label>
                <span class="info-value">{{ orderData.basicInfo.name }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">邮箱：</label>
                <span class="info-value">{{ orderData.basicInfo.email }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">电话：</label>
                <span class="info-value">{{ orderData.basicInfo.phone }}</span>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h3 class="section-title">需求信息</h3>
            <div class="requirements-content">
              <p class="requirements-text">{{ orderData.requirements }}</p>
            </div>
          </div>
          
          <div class="info-section">
            <h3 class="section-title">时间信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">提交时间：</label>
                <span class="info-value">{{ formatDate(orderData.submittedAt) }}</span>
              </div>
              <div v-if="orderData.updatedAt" class="info-item">
                <label class="info-label">更新时间：</label>
                <span class="info-value">{{ formatDate(orderData.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="danger-zone">
          <div class="danger-header">
            <span style="color: #f56c6c; font-size: 20px;">⚠️</span>
            <span class="danger-title">危险操作</span>
          </div>
          <p class="danger-description">
            删除工单后将无法恢复，请确认您真的要删除这个工单。
          </p>
          <el-button 
            type="danger" 
            size="large"
            @click="deleteOrder"
            :loading="isDeleting"
            :disabled="isSearching"
          >
            🗑️ {{ isDeleting ? '删除中...' : '确认删除工单' }}
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="!orderFound && searchId" class="empty-state">
      <el-empty 
        description="请先搜索要删除的工单"
        :image-size="120"
      >
        <template #image>
          <div style="font-size: 120px; color: #909399;">🔍</div>
        </template>
      </el-empty>
    </div>

    <!-- 警告提示 -->
    <div class="warning-notice">
      <el-alert
        title="重要提醒"
        type="warning"
        :closable="false"
        show-icon
      >
        <template #default>
          <p>删除工单是不可逆操作，请谨慎使用此功能。建议在删除前确认工单信息无误。</p>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<style scoped>
.function4-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.page-description {
  font-size: 16px;
  color: #f56c6c;
  margin: 0;
  font-weight: 500;
}

.search-section {
  margin-bottom: 30px;
}

.search-card, .order-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  width: 100%;
}

.search-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.order-details-section {
  margin-bottom: 30px;
}

.order-info {
  padding: 20px 0;
}

.info-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #606266;
  min-width: 80px;
  margin-right: 10px;
}

.info-value {
  color: #303133;
  word-break: break-all;
}

.requirements-content {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.requirements-text {
  margin: 0;
  line-height: 1.6;
  color: #303133;
  white-space: pre-wrap;
}

.danger-zone {
  margin-top: 30px;
  padding: 20px;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 6px;
  text-align: center;
}

.danger-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.danger-title {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.danger-description {
  color: #909399;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.warning-notice {
  margin-top: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .function4-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .search-buttons {
    flex-direction: column;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    min-width: auto;
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .function4-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-description {
    font-size: 14px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 14px;
  }
}
</style>