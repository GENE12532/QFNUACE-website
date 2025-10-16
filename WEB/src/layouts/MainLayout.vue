<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import Header from "@/components/Header.vue";
import Roller from "@/components/Roller.vue";
</script>

<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat" style="background-image: url('/red.png')">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6">
        <Header />
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-full mx-auto my-8 px-4">
      <!-- 使用 el-container 布局 -->
      <el-container class="min-h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- 侧边栏 - 添加分割线 -->
        <el-aside
            class="!w-64 !min-h-full bg-white"
            style="border-right: 4px solid #dc2626"
        >
          <Roller />
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="flex-1 p-8">
          <!-- 这里使用 router-view 来显示子页面内容 -->
          <router-view />
        </el-main>
      </el-container>
    </div>
  </div>
</template>