
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import API_CONFIG from '@/config/api'

// 定义接口类型
interface BasicInfo {
  name: string
  email: string
  phone: string
}

interface OrderData {
  id: string
  basicInfo: BasicInfo
  requirements: string
  submittedAt?: string
  updatedAt?: string
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
const isUpdating = ref(false)
const orderFound = ref(false)
const currentOrder = ref<OrderData | null>(null)

// 表单数据
const formData = reactive<OrderData>({
  id: '',
  basicInfo: {
    name: '',
    email: '',
    phone: ''
  },
  requirements: ''
})

// 表单验证规则
const rules = {
  'basicInfo.name': [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  'basicInfo.email': [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  'basicInfo.phone': [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  requirements: [
    { required: true, message: '请输入需求描述', trigger: 'blur' },
    { min: 10, max: 1000, message: '需求描述长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 搜索工单
const searchOrder = async () => {
  if (!searchId.value.trim()) {
    ElMessage.warning('请输入工单ID')
    return
  }

  isSearching.value = true
  orderFound.value = false

  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ORDER}/${searchId.value.trim()}`)
    
    if (response.data.code === 200 && response.data.data) {
      const orderData: SearchResult = response.data.data
      
      // 填充表单数据
      formData.id = orderData.id
      formData.basicInfo.name = orderData.basicInfo.name
      formData.basicInfo.email = orderData.basicInfo.email
      formData.basicInfo.phone = orderData.basicInfo.phone
      formData.requirements = orderData.requirements
      
      currentOrder.value = { ...formData }
      orderFound.value = true
      
      ElMessage.success('工单查找成功，可以开始编辑')
    } else {
      ElMessage.error('未找到该工单')
      resetForm()
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
    
    resetForm()
  } finally {
    isSearching.value = false
  }
}

// 更新工单
const updateOrder = async () => {
  // 验证必填字段
  if (!formData.basicInfo.name.trim()) {
    ElMessage.warning('请输入姓名')
    return
  }
  if (!formData.basicInfo.email.trim()) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  if (!formData.basicInfo.phone.trim()) {
    ElMessage.warning('请输入电话号码')
    return
  }
  if (!formData.requirements.trim()) {
    ElMessage.warning('请输入需求描述')
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.basicInfo.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.basicInfo.phone)) {
    ElMessage.warning('请输入正确的手机号码')
    return
  }

  // 检查是否有修改
  if (currentOrder.value) {
    const hasChanges = 
      formData.basicInfo.name !== currentOrder.value.basicInfo.name ||
      formData.basicInfo.email !== currentOrder.value.basicInfo.email ||
      formData.basicInfo.phone !== currentOrder.value.basicInfo.phone ||
      formData.requirements !== currentOrder.value.requirements

    if (!hasChanges) {
      ElMessage.info('没有检测到任何修改')
      return
    }
  }

  try {
    await ElMessageBox.confirm(
      '确定要更新这个工单吗？',
      '确认更新',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  } catch {
    return // 用户取消
  }

  isUpdating.value = true

  try {
    const updateData = {
      basicInfo: {
        name: formData.basicInfo.name.trim(),
        email: formData.basicInfo.email.trim(),
        phone: formData.basicInfo.phone.trim()
      },
      requirements: formData.requirements.trim()
    }

    const response = await axios.patch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_ORDER}/${formData.id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.code === 200) {
      ElMessage.success('工单更新成功！')
      
      // 更新当前工单数据
      currentOrder.value = { ...formData }
      
      // 可选：重新搜索以获取最新数据
      setTimeout(() => {
        searchOrder()
      }, 1000)
    } else {
      ElMessage.error(`更新失败: ${response.data.message || '未知错误'}`)
    }
  } catch (error: any) {
    console.error('更新工单失败:', error)
    
    if (error.response?.status === 404) {
      ElMessage.error('工单不存在，可能已被删除')
      resetForm()
    } else if (error.response?.status === 400) {
      ElMessage.error(`请求参数错误: ${error.response.data?.message || ''}`)
    } else if (error.code === 'ECONNREFUSED') {
      ElMessage.error('无法连接到服务器，请检查网络连接')
    } else {
      ElMessage.error(`更新失败: ${error.response?.data?.message || error.message || '未知错误'}`)
    }
  } finally {
    isUpdating.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.basicInfo.name = ''
  formData.basicInfo.email = ''
  formData.basicInfo.phone = ''
  formData.requirements = ''
  currentOrder.value = null
  orderFound.value = false
}

// 重置搜索
const resetSearch = () => {
  searchId.value = ''
  resetForm()
}

// 键盘事件处理
const handleSearchKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    searchOrder()
  }
}
</script>

<template>
  <div class="function3-container">
    <div class="page-header">
      <h1 class="page-title">更新工单</h1>
      <p class="page-description">搜索并更新现有工单信息</p>
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
            :disabled="isSearching"
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
              :disabled="!searchId.trim()"
            >
              🔍 {{ isSearching ? '搜索中...' : '搜索工单' }}
            </el-button>
            
            <el-button
              @click="resetSearch"
              :disabled="isSearching"
            >
              🔄 重置
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 编辑区域 -->
    <div v-if="orderFound" class="edit-section">
      <el-card class="edit-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">编辑工单 - {{ formData.id }}</span>
          </div>
        </template>
        
        <el-form 
          :model="formData" 
          :rules="rules" 
          label-width="120px"
          class="edit-form"
        >
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            
            <el-form-item label="姓名" prop="basicInfo.name">
              <el-input
                v-model="formData.basicInfo.name"
                placeholder="请输入姓名"
                :disabled="isUpdating"
                clearable
              />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="basicInfo.email">
              <el-input
                v-model="formData.basicInfo.email"
                placeholder="请输入邮箱地址"
                :disabled="isUpdating"
                clearable
              />
            </el-form-item>
            
            <el-form-item label="电话" prop="basicInfo.phone">
              <el-input
                v-model="formData.basicInfo.phone"
                placeholder="请输入电话号码"
                :disabled="isUpdating"
                clearable
              />
            </el-form-item>
          </div>
          
          <div class="form-section">
            <h3 class="section-title">需求信息</h3>
            
            <el-form-item label="需求描述" prop="requirements">
              <el-input
                v-model="formData.requirements"
                type="textarea"
                :rows="6"
                placeholder="请详细描述您的需求..."
                :disabled="isUpdating"
                show-word-limit
                maxlength="1000"
              />
            </el-form-item>
          </div>
          
          <div class="form-actions">
            <el-button
              type="primary"
              @click="updateOrder"
              :loading="isUpdating"
              size="large"
            >
              ✏️ {{ isUpdating ? '更新中...' : '更新工单' }}
            </el-button>
            
            <el-button
              @click="resetForm"
              :disabled="isUpdating"
              size="large"
            >
              🔄 重置表单
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="!orderFound && searchId" class="empty-state">
      <el-empty 
        description="请先搜索要更新的工单"
        :image-size="120"
      >
        <template #image>
          <div style="font-size: 120px; color: #909399;">🔍</div>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<style scoped>
.function3-container {
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
  color: #606266;
  margin: 0;
}

.search-section {
  margin-bottom: 30px;
}

.search-card, .edit-card {
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

.edit-section {
  margin-bottom: 30px;
}

.edit-form {
  padding: 20px 0;
}

.form-section {
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

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .function3-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .search-buttons {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}

/* 加载状态样式 */
.el-button.is-loading {
  pointer-events: none;
}

/* 表单验证错误样式 */
.el-form-item.is-error .el-input__inner {
  border-color: #f56c6c;
}

.el-form-item.is-error .el-textarea__inner {
  border-color: #f56c6c;
}
</style>