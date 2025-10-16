<script setup lang="ts">
import { ref } from 'vue';

const list = ref([
  { id: 1, name: "功能1", icon: "🚀", description: "功能1的详细描述信息", href: "function1" },
  { id: 2, name: "功能2", icon: "🎯", description: "功能2的详细描述信息", href: "function2" },
  { id: 3, name: "功能3", icon: "🔧", description: "功能3的详细描述信息", href: "function3" },
  { id: 4, name: "功能4", icon: "📊", description: "功能4的详细描述信息", href: "function4" },
]);
</script>

<template>
  <div class="h-full p-6 overflow-y-auto" style="background-color: rgba(239, 68, 68, 0.3);">
    <div class="space-y-6">
      <router-link
          v-for="item in list"
          :key="item.id"
          :to="item.href"
          custom
          v-slot="{ navigate }"
      >
        <div
            @click="navigate"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 cursor-pointer transform hover:-translate-y-1"
            style="background-color: rgba(255, 255, 255, 0.8)"
        >
          <div class="flex items-start space-x-4">
            <!-- 图标 -->
            <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
              <span class="text-xl group-hover:text-white transition-colors duration-300">{{ item.icon }}</span>
            </div>

            <!-- 内容 -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                {{ item.name }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ item.description }}
              </p>

              <!-- 操作按钮 -->
              <div class="mt-4 flex items-center justify-between">
                <span class="text-blue-500 text-sm font-medium group-hover:text-blue-600 transition-colors">
                  立即使用 →
                </span>
                <div class="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>