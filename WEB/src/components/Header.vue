<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowDownBold, Search, UserFilled, SwitchButton } from "@element-plus/icons-vue";
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();
const input = ref("");

const handleLogin = () => {
  router.push('/login');
};

const handleLogout = () => {
  authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};

// 动态导航菜单
const navItems = computed(() => {
  const items: { name: string; href: string; hasDropdown?: boolean }[] = [
    { name: "首页", href: "/home" },
  ];

  // 只有登录后才显示工单相关功能
  if (authStore.isAuthenticated) {
    // 管理员可以看到所有功能
    if (authStore.isAdmin) {
      items.push({ name: "创建工单", href: "/create" });
      items.push({ name: "更新工单", href: "/update" });
      items.push({ name: "删除工单", href: "/delete" });
    }
    // 所有登录用户都可以查询
    items.push({ name: "查询工单", href: "/search" });
  }

  items.push({ name: "关于", href: "/about" });
  
  return items;
});
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <!-- 主导航 -->
    <nav class="flex items-center space-x-8">
      <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
      >
        <span>{{ item.name }}</span>
        <el-icon v-if="item.hasDropdown" class="group-hover:rotate-180 transition-transform duration-200">
          <ArrowDownBold />
        </el-icon>
      </router-link>
    </nav>

    <!-- 搜索和用户操作 -->
    <div class="flex items-center space-x-6">
      <!-- 搜索框 (仅登录后显示) -->
      <div class="relative" v-if="authStore.isAuthenticated">
        <el-input
            v-model="input"
            placeholder="搜索功能..."
            class="w-64"
            size="large"
        >
          <template #prefix>
            <el-icon class="text-gray-400">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <!-- 用户操作 -->
      <div class="flex items-center space-x-4">
        <template v-if="authStore.isAuthenticated">
          <div class="flex items-center space-x-2 text-gray-700">
            <el-icon><UserFilled /></el-icon>
            <span class="font-medium">{{ authStore.username }}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {{ authStore.isAdmin ? '管理员' : '访客' }}
            </span>
          </div>
          <el-button
            @click="handleLogout"
            size="default"
            type="danger"
            plain
            circle
            :icon="SwitchButton"
            title="退出登录"
          />
        </template>
        
        <template v-else>
          <el-button
              @click="handleLogin"
              size="large"
              type="primary"
              class="bg-blue-600 hover:bg-blue-700 px-6 transition-colors font-medium"
          >
            登录
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}
</style>