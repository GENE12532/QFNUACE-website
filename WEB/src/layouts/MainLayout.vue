<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import Header from "@/components/Header.vue";
import Roller from "@/components/Roller.vue";
import { useRoute } from 'vue-router';
import {computed} from "vue";

const route = useRoute();

const isHomePage = computed(() => route.path === '/home');
</script>

<template>
  <div class="min-h-screen main-layout">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6">
        <Header />
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-full mx-auto my-8 px-4" style="background-color: rgba(255,255,255, 0.6);">
      <el-container class="min-h-[calc(100vh-12rem)] bg-white/80 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
        <!-- 侧边栏 -->
        <el-aside
            v-if="!isHomePage"
            class="!w-64 !min-h-full bg-white/90">
          <Roller />
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="flex-1 p-8 bg-white/">
          <router-view />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  background-image: url('../public/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>