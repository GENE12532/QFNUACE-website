<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownBold, Search } from "@element-plus/icons-vue";

const input = ref("");
const login = () => {};
const register = () => {};

const navItems = [
  { name: "首页", href: "/" },
  { name: "功能1", href: "/function1" },
  { name: "功能2", href: "#" },
  { name: "组合功能", href: "#", hasDropdown: true },
  { name: "关于", href: "#" }
];
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
      <!-- 搜索框 -->
      <div class="relative">
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
        <el-button
            @click="login"
            size="large"
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          登录
        </el-button>
        <el-button
            @click="register"
            size="large"
            type="primary"
            class="bg-blue-600 hover:bg-blue-700 px-6 transition-colors font-medium"
        >
          注册
        </el-button>
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