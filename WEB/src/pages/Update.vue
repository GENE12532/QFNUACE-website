
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import API_CONFIG from '@/config/api'

// 定义接口类型
interface OrderData {
  _id: string
  日期: string
  年级学院: string
  被诊者: string
  联系: string
  号码: string
  电脑型号: string
  业务: string
  操作人员: string
  检察人员: string
  备注: string
  创建时间?: string
  更新时间?: string
}

// 响应式数据
const searchId = ref('')
const isSearching = ref(false)
const isUpdating = ref(false)
const orderFound = ref(false)
const currentOrder = ref<OrderData | null>(null)

// 表单数据
const formData = reactive<OrderData>({
  _id: '',
  日期: '',
  年级学院: '',
  被诊者: '',
  联系: '电话',
  号码: '',
  电脑型号: '',
  业务: '',
  操作人员: '',
  检察人员: '',
  备注: ''
})

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
      const orderData: OrderData = response.data.data
      
      // 填充表单数据
      formData._id = orderData._id
      formData.日期 = orderData.日期
      formData.年级学院 = orderData.年级学院
      formData.被诊者 = orderData.被诊者
      formData.联系 = orderData.联系
      formData.号码 = orderData.号码
      formData.电脑型号 = orderData.电脑型号
      formData.业务 = orderData.业务
      formData.操作人员 = orderData.操作人员
      formData.检察人员 = orderData.检察人员
      formData.备注 = orderData.备注
      
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
  if (!formData.被诊者.trim()) {
    ElMessage.warning('请输入被诊者姓名')
    return
  }
  if (!formData.号码.trim()) {
    ElMessage.warning('请输入联系号码')
    return
  }
  if (!formData.电脑型号.trim()) {
    ElMessage.warning('请输入电脑型号')
    return
  }
  if (!formData.业务.trim()) {
    ElMessage.warning('请选择业务类型')
    return
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
      日期: formData.日期.trim(),
      年级学院: formData.年级学院.trim(),
      被诊者: formData.被诊者.trim(),
      联系: formData.联系,
      号码: formData.号码.trim(),
      电脑型号: formData.电脑型号.trim(),
      业务: formData.业务,
      操作人员: formData.操作人员.trim(),
      检察人员: formData.检察人员.trim(),
      备注: formData.备注.trim()
    }

    const response = await axios.patch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_ORDER}/${formData._id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.code === 200) {
      ElMessage.success('工单更新成功！')
      currentOrder.value = { ...formData }
    } else {
      ElMessage.error(`更新失败: ${response.data.message || '未知错误'}`)
    }
  } catch (error: any) {
    console.error('更新工单失败:', error)
    
    if (error.response?.status === 404) {
      ElMessage.error('工单不存在，可能已被删除')
      resetForm()
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
  formData._id = ''
  formData.日期 = ''
  formData.年级学院 = ''
  formData.被诊者 = ''
  formData.联系 = '电话'
  formData.号码 = ''
  formData.电脑型号 = ''
  formData.业务 = ''
  formData.操作人员 = ''
  formData.检察人员 = ''
  formData.备注 = ''
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
      <p class="page-description">搜索并更新现有维修工单信息</p>
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
            placeholder="请输入工单ID（MongoDB ObjectId）"
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
            <span class="card-title">编辑工单</span>
          </div>
        </template>
        
        <el-form :model="formData" label-width="120px" class="edit-form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="日期">
                <el-input v-model="formData.日期" placeholder="例：2025.3.5" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年级学院">
                <el-input v-model="formData.年级学院" placeholder="例：23网安" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="被诊者" required>
                <el-input v-model="formData.被诊者" placeholder="请输入被诊者姓名" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <el-select v-model="formData.联系" :disabled="isUpdating" style="width: 100%">
                  <el-option label="电话" value="电话" />
                  <el-option label="微信" value="微信" />
                  <el-option label="QQ" value="QQ" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系号码" required>
                <el-input v-model="formData.号码" placeholder="请输入联系号码" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电脑型号" required>
                <el-input v-model="formData.电脑型号" placeholder="例：戴尔g15_5530" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="业务类型" required>
                <el-select v-model="formData.业务" placeholder="请选择业务类型" :disabled="isUpdating" style="width: 100%">
                  <el-option label="清灰" value="清灰" />
                  <el-option label="重装系统" value="重装系统" />
                  <el-option label="硬件维修" value="硬件维修" />
                  <el-option label="软件安装" value="软件安装" />
                  <el-option label="病毒清理" value="病毒清理" />
                  <el-option label="数据恢复" value="数据恢复" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作人员">
                <el-input v-model="formData.操作人员" placeholder="请输入操作人员姓名" :disabled="isUpdating" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="检察人员">
            <el-input v-model="formData.检察人员" placeholder="例：张长宇、刘沛" :disabled="isUpdating" />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input v-model="formData.备注" type="textarea" :rows="4" placeholder="请输入备注信息..." :disabled="isUpdating" />
          </el-form-item>
          
          <div class="form-actions">
            <el-button type="primary" @click="updateOrder" :loading="isUpdating" size="large">
              ✏️ {{ isUpdating ? '更新中...' : '更新工单' }}
            </el-button>
            <el-button @click="resetForm" :disabled="isUpdating" size="large">
              🔄 重置表单
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="!orderFound && !searchId" class="empty-state">
      <el-empty description="请先搜索要更新的工单" :image-size="120">
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
</style>