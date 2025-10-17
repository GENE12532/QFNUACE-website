<script setup lang="ts">
import { ref } from 'vue';

const list = ref([
  { id: 1, name: "创建工单", icon: "📝", description: "创建新的电脑维修工单，填写详细的维修信息", href: "create" },
  { id: 2, name: "查询工单", icon: "🔍", description: "根据条件搜索和查看现有的维修工单", href: "search" },
  { id: 3, name: "更新工单", icon: "✏️", description: "修改和更新现有工单的信息", href: "update" },
  { id: 4, name: "删除工单", icon: "🗑️", description: "删除不需要的工单（此操作不可恢复）", href: "delete" },
]);

// 操作指南数据
const guideSteps = ref([
  {
    step: 1,
    title: "启动服务器",
    description: "首先需要启动后端服务器",
    commands: [
      "cd QFNUACE-website/SERVER",
      "npm install",
      "npm start"
    ],
    note: "确保MongoDB数据库正在运行"
  },
  {
    step: 2,
    title: "启动前端",
    description: "在新的终端窗口中启动前端应用",
    commands: [
      "cd QFNUACE-website/WEB",
      "npm install",
      "npm run dev"
    ],
    note: "前端将在 http://localhost:5173 运行"
  },
  {
    step: 3,
    title: "使用功能",
    description: "现在可以使用各项功能了",
    commands: [],
    note: "点击上方的功能卡片开始使用"
  }
]);

const showGuide = ref(false);

const toggleGuide = () => {
  showGuide.value = !showGuide.value;
};
</script>

<template>
  <div class="h-full p-6 overflow-y-auto">
    <!-- 操作指南按钮 -->
    <div class="mb-6">
      <button
        @click="toggleGuide"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>📖</span>
        {{ showGuide ? '隐藏操作指南' : '显示操作指南' }}
      </button>
    </div>

    <!-- 操作指南内容 -->
    <div v-if="showGuide" class="mb-6 bg-white rounded-xl shadow-md p-6" style="background-color: rgba(255, 255, 255, 0.95);">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📋</span>
        操作指南
      </h2>
      
      <div class="space-y-4">
        <div v-for="guide in guideSteps" :key="guide.step" class="border-l-4 border-blue-500 pl-4">
          <h3 class="font-semibold text-gray-800 mb-2">
            步骤 {{ guide.step }}: {{ guide.title }}
          </h3>
          <p class="text-gray-600 text-sm mb-2">{{ guide.description }}</p>
          
          <div v-if="guide.commands.length > 0" class="bg-gray-100 rounded p-3 mb-2">
            <div v-for="command in guide.commands" :key="command" class="font-mono text-sm text-gray-800 mb-1">
              <span class="text-green-600">$</span> {{ command }}
            </div>
          </div>
          
          <p class="text-blue-600 text-sm font-medium">💡 {{ guide.note }}</p>
        </div>
      </div>

      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 class="font-semibold text-yellow-800 mb-2">⚠️ 重要提醒</h4>
        <ul class="text-yellow-700 text-sm space-y-1">
          <li>• 确保MongoDB数据库服务正在运行</li>
          <li>• 后端服务器默认运行在端口3000</li>
          <li>• 前端应用默认运行在端口5173</li>
          <li>• 如遇网络错误，请检查服务器连接状态</li>
        </ul>
      </div>
    </div>

    <!-- 功能卡片 -->
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
            class="group bg-white my-8 shadow-md hover:shadow-xl rounded-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 cursor-pointer transform hover:-translate-y-1"
            style="background-color: rgba(255, 255, 255, 0.6)"
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