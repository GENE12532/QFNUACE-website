<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import API_CONFIG from '@/config/api'

// 搜索表单数据
const searchForm = reactive({
  被诊者: '',
  号码: '',
  电脑型号: '',
  业务: '',
  年级学院: '',
  操作人员: ''
})

// 搜索结果
const searchResults = ref([])
const loading = ref(false)

// 搜索提交记录
const handleSearch = async () => {
  // 检查是否至少填写了一个搜索条件
  if (!searchForm.被诊者 && !searchForm.号码 && !searchForm.电脑型号 && !searchForm.业务 && !searchForm.年级学院 && !searchForm.操作人员) {
    ElMessage.warning('请至少填写一个搜索条件')
    return
  }

  loading.value = true
  
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    if (searchForm.被诊者) params.append('被诊者', searchForm.被诊者)
    if (searchForm.号码) params.append('号码', searchForm.号码)
    if (searchForm.电脑型号) params.append('电脑型号', searchForm.电脑型号)
    if (searchForm.业务) params.append('业务', searchForm.业务)
    if (searchForm.年级学院) params.append('年级学院', searchForm.年级学院)
    if (searchForm.操作人员) params.append('操作人员', searchForm.操作人员)

    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}?${params.toString()}`)
    
    if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
      searchResults.value = response.data.data
      ElMessage.success(`找到 ${response.data.data.length} 条记录`)
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
  searchForm.被诊者 = ''
  searchForm.号码 = ''
  searchForm.电脑型号 = ''
  searchForm.业务 = ''
  searchForm.年级学院 = ''
  searchForm.操作人员 = ''
  searchResults.value = []
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  try {
    return new Date(dateString).toLocaleString('zh-CN')
  } catch {
    return dateString
  }
}
</script>

<template>
  <div class="function2-container">
    <div class="search-section">
      <h2 class="section-title">查询维修工单</h2>
      
      <!-- 搜索表单 -->
      <el-form :model="searchForm" label-width="80px" class="search-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="被诊者">
              <el-input 
                v-model="searchForm.被诊者" 
                placeholder="请输入被诊者姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系号码">
              <el-input 
                v-model="searchForm.号码" 
                placeholder="请输入联系号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电脑型号">
              <el-input 
                v-model="searchForm.电脑型号" 
                placeholder="请输入电脑型号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="业务类型">
              <el-select 
                v-model="searchForm.业务" 
                placeholder="请选择业务类型"
                clearable
                style="width: 100%"
              >
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
          <el-col :span="8">
            <el-form-item label="年级学院">
              <el-input 
                v-model="searchForm.年级学院" 
                placeholder="请输入年级学院"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人员">
              <el-input 
                v-model="searchForm.操作人员" 
                placeholder="请输入操作人员"
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
        <el-table-column prop="_id" label="工单ID" width="100">
          <template #default="scope">
            <span class="id-text">{{ scope.row._id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="日期" label="日期" width="100" />
        <el-table-column prop="被诊者" label="被诊者" width="120" />
        <el-table-column prop="年级学院" label="年级学院" width="120" />
        <el-table-column prop="号码" label="联系号码" width="150" />
        <el-table-column prop="电脑型号" label="电脑型号" width="180" />
        <el-table-column prop="业务" label="业务类型" width="120" />
        <el-table-column prop="操作人员" label="操作人员" width="120" />
        <el-table-column prop="检察人员" label="检察人员" width="150" />
        <el-table-column label="备注" min-width="200">
          <template #default="scope">
            <el-tooltip :content="scope.row.备注 || '无'" placement="top">
              <span class="requirements-text">
                {{ scope.row.备注 || '无' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.创建时间) }}
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
  max-width: 1400px;
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

.id-text {
  font-family: monospace;
  font-size: 12px;
  color: #666;
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