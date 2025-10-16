<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import API_CONFIG from '@/config/api'

// 搜索表单数据
const searchForm = reactive({
  name: '',
  email: '',
  phone: ''
})

// 搜索结果
const searchResults = ref([])
const loading = ref(false)

// 搜索提交记录
const handleSearch = async () => {
  // 检查是否至少填写了一个搜索条件
  if (!searchForm.name && !searchForm.email && !searchForm.phone) {
    ElMessage.warning('请至少填写一个搜索条件')
    return
  }

  loading.value = true
  
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    if (searchForm.name) params.append('name', searchForm.name)
    if (searchForm.email) params.append('email', searchForm.email)
    if (searchForm.phone) params.append('phone', searchForm.phone)

    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}?${params.toString()}`)
    
    if (response.data && Array.isArray(response.data)) {
      searchResults.value = response.data
      ElMessage.success(`找到 ${response.data.length} 条记录`)
    } else {
      searchResults.value = []
      ElMessage.info('未找到匹配的记录')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any
      ElMessage.error(`搜索失败: ${axiosError.response?.data?.message || '服务器错误'}`)
    } else if (error && typeof error === 'object' && 'request' in error) {
      ElMessage.error('搜索失败: 无法连接到服务器')
    } else {
      ElMessage.error('搜索失败: 请求配置错误')
    }
  } finally {
    loading.value = false
  }
}

// 重置搜索表单
const resetForm = () => {
  searchForm.name = ''
  searchForm.email = ''
  searchForm.phone = ''
  searchResults.value = []
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="function2-container">
    <div class="search-section">
      <h2 class="section-title">查询提交记录</h2>
      
      <!-- 搜索表单 -->
      <el-form :model="searchForm" label-width="80px" class="search-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input 
                v-model="searchForm.email" 
                placeholder="请输入邮箱"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话">
              <el-input 
                v-model="searchForm.phone" 
                placeholder="请输入电话"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSearch"
            :loading="loading"
          >
            搜索
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 搜索结果 -->
    <div class="results-section" v-if="searchResults.length > 0">
      <h3 class="results-title">搜索结果 ({{ searchResults.length }} 条)</h3>
      
      <el-table :data="searchResults" border stripe>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column label="姓名" width="120">
          <template #default="scope">
            {{ scope.row.basicInfo?.name || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="200">
          <template #default="scope">
            {{ scope.row.basicInfo?.email || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="电话" width="150">
          <template #default="scope">
            {{ scope.row.basicInfo?.phone || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="需求" min-width="200">
          <template #default="scope">
            <el-tooltip :content="scope.row.requirements" placement="top">
              <span class="requirements-text">
                {{ scope.row.requirements || '无' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.submittedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 无结果提示 -->
    <div class="no-results" v-else-if="!loading">
      <el-empty description="暂无搜索结果" />
    </div>
  </div>
</template>

<style scoped>
.function2-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  color: #303133;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.search-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.search-form {
  margin-top: 20px;
}

.results-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.results-title {
  color: #303133;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
}

.requirements-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}
</style>