<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <h1 class="text-4xl font-bold text-center mb-4 neutral-dark" style="margin: 30px 0 40px">
      功能中心
    </h1>

    <!-- 走马灯和侧边栏区域（你之前的内容） -->
    <div class="main-content-layout">
      <!-- 左侧列表 -->
      <div class="left-sidebar">
        <div class="sidebar-card glass-effect">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">常用功能</h3>
          <ul class="space-y-3">
            <li
                v-for="item in leftItems"
                :key="item.id"
                class="flex items-center p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
            >
              <span class="w-2 h-2 bg-blue-400 animate-pulse rounded-full mr-3"></span>
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 中间走马灯 -->
      <div class="carousel-section">
        <el-carousel :interval="4000" type="card" height="300px" class="custom-carousel">
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <div class="carousel-content full-bg" :style="{ background: item.color }">
              <h3 class="text-2xl font-bold text-white" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">{{ item.title }}</h3>
              <p class="text-white/90 mt-2">{{ item.description }}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 右侧列表 -->
      <div class="right-sidebar">
        <div class="sidebar-card glass-effect">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">最新动态</h3>
          <ul class="space-y-3">
            <li
                v-for="item in rightItems"
                :key="item.id"
                class="flex items-start p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
            >
              <span class="w-2 h-2 bg-blue-400 animate-pulse rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <div>
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-sm text-gray-500">{{ item.time }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 新闻资讯区域 -->
    <div class="news-section">
      <div class="news-header">
        <h2 class="text-3xl font-bold" style="margin-right: 40px">最新资讯</h2>
        <div class="news-tabs">
          <button
              v-for="tab in newsTabs"
              :key="tab.id"
              @click="activeNewsTab = tab.id"
              :class="['tab-button', { active: activeNewsTab === tab.id }]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="news-content">
        <!-- 左侧大图新闻 -->
        <div class="featured-news">
          <div class="featured-card" v-if="featuredNews">
            <img :src="featuredNews.image" :alt="featuredNews.title" class="featured-image">
            <div class="featured-overlay">
              <span class="news-category">{{ featuredNews.category }}</span>
              <h3 class="featured-title">{{ featuredNews.title }}</h3>
              <p class="featured-desc">{{ featuredNews.description }}</p>
              <div class="news-meta">
                <span class="news-time">{{ featuredNews.time }}</span>
                <span class="news-views">👁️ {{ featuredNews.views }} 阅读</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间新闻列表 -->
        <div class="news-list">
          <div
              v-for="news in currentNewsList"
              :key="news.id"
              class="news-item"
          >
            <div class="news-item-content">
              <h4 class="news-item-title">{{ news.title }}</h4>
              <p class="news-item-desc">{{ news.description }}</p>
              <div class="news-item-meta">
                <span class="news-item-category">{{ news.category }}</span>
                <span class="news-item-time">{{ news.time }}</span>
                <span class="news-item-views">👁️ {{ news.views }}</span>
              </div>
            </div>
            <img v-if="news.image" :src="news.image" :alt="news.title" class="news-item-image">
          </div>
        </div>

        <!-- 右侧排行榜 -->
        <div class="news-ranking">
          <div class="ranking-card">
            <h3 class="ranking-title">热门排行</h3>
            <div class="ranking-list">
              <div
                  v-for="(item, index) in hotRanking"
                  :key="item.id"
                  class="ranking-item"
                  :class="`rank-${index + 1}`"
              >
                <span class="ranking-number">{{ index + 1 }}</span>
                <div class="ranking-content">
                  <div class="ranking-title-text">{{ item.title }}</div>
                  <div class="ranking-views">{{ item.views }} 阅读</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签云 -->
          <div class="tags-card">
            <h3 class="tags-title">热门标签</h3>
            <div class="tags-list">
              <span
                  v-for="tag in hotTags"
                  :key="tag.id"
                  class="tag"
                  :style="{ backgroundColor: tag.color }"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 新闻标签页
const newsTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术资讯' },
  { id: 'update', name: '系统更新' },
  { id: 'event', name: '活动通知' },
  { id: 'guide', name: '使用指南' }
]);

const activeNewsTab = ref('all');

// 精选新闻
const featuredNews = ref({
  id: 1,
  title: '新一代智能工单管理系统正式上线',
  description: '全新升级的工单管理系统，提供更智能的故障诊断和更高效的处理流程，助力企业数字化转型。',
  category: '系统更新',
  time: '2024-01-15',
  views: 2845,
  image: '/api/placeholder/600/400'
});

// 新闻列表数据
const newsList = ref([
  {
    id: 1,
    title: '如何快速创建维修工单？详细教程来了',
    description: '本文详细介绍如何使用系统快速创建维修工单，包括常见问题解答和最佳实践。',
    category: '使用指南',
    time: '2024-01-14',
    views: 1562,
    image: '/api/placeholder/120/80'
  },
  {
    id: 2,
    title: '系统维护通知：本周六凌晨进行数据库升级',
    description: '为提升系统性能，计划于本周六凌晨进行数据库升级，预计耗时2小时。',
    category: '系统更新',
    time: '2024-01-13',
    views: 892,
    image: '/api/placeholder/120/80'
  },
  {
    id: 3,
    title: 'AI技术在故障诊断中的应用前景',
    description: '探讨人工智能技术如何在设备故障诊断中发挥作用，提升维修效率。',
    category: '技术资讯',
    time: '2024-01-12',
    views: 1247,
    image: '/api/placeholder/120/80'
  },
  {
    id: 4,
    title: '用户反馈汇总：2023年第四季度',
    description: '汇总整理用户反馈，持续优化产品体验，感谢各位用户的宝贵建议。',
    category: '活动通知',
    time: '2024-01-11',
    views: 734,
    image: '/api/placeholder/120/80'
  },
  {
    id: 5,
    title: '移动端APP更新，支持扫码创建工单',
    description: '最新版移动端APP已发布，新增扫码创建工单功能，随时随地处理维修任务。',
    category: '系统更新',
    time: '2024-01-10',
    views: 1689,
    image: '/api/placeholder/120/80'
  }
]);

// 热门排行
const hotRanking = ref([
  { id: 1, title: '系统使用完全指南', views: 3245 },
  { id: 2, title: '常见问题解决方案', views: 2987 },
  { id: 3, title: '新功能使用教程', views: 2678 },
  { id: 4, title: '权限管理说明', views: 2341 },
  { id: 5, title: '数据备份指南', views: 1987 }
]);

// 热门标签
const hotTags = ref([
  { id: 1, name: '系统更新', color: '#3b82f6' },
  { id: 2, name: '技术文档', color: '#10b981' },
  { id: 3, name: '使用教程', color: '#f59e0b' },
  { id: 4, name: '故障排除', color: '#ef4444' },
  { id: 5, name: '最佳实践', color: '#8b5cf6' },
  { id: 6, name: '版本发布', color: '#06b6d4' }
]);

// 计算当前显示的新闻列表
const currentNewsList = computed(() => {
  if (activeNewsTab.value === 'all') {
    return newsList.value;
  }
  return newsList.value.filter(news =>
      news.category === newsTabs.value.find(tab => tab.id === activeNewsTab.value)?.name
  );
});

const carouselItems = ref([
  {
    id: 1,
    title: '快速创建工单',
    description: '一键创建维修工单，提高工作效率',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: '智能查询系统',
    description: '多种条件快速定位工单信息',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    title: '实时状态更新',
    description: '随时掌握工单处理进度',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    title: '数据统计分析',
    description: '可视化报表，助力决策分析',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]);

// 左侧列表数据
const leftItems = ref([
  { id: 1, name: '工单管理' },
  { id: 2, name: '设备管理' },
  { id: 3, name: '用户管理' },
  { id: 4, name: '报表统计' },
  { id: 5, name: '系统设置' },
  { id: 6, name: '消息中心' }
]);

// 右侧列表数据
const rightItems = ref([
  { id: 1, title: '系统维护通知', time: '2小时前' },
  { id: 2, title: '新功能上线', time: '1天前' },
  { id: 3, title: '数据备份完成', time: '2天前' },
  { id: 4, title: '用户反馈汇总', time: '3天前' },
  { id: 5, title: '版本更新计划', time: '1周前' }
]);
</script>

<style scoped>
.main-content-layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px; /* 缩小侧边栏宽度 */
  gap: 1.5rem; /* 缩小间距 */
  align-items: start;
  max-width: 1200px; /* 缩小整体宽度 */
  margin: 0 auto;
}

.carousel-content.full-bg {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
}

.news-section {
  max-width: 1400px;
  margin: 4rem auto 2rem;
  padding: 0 1rem;
}

.news-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
}

.news-tabs {
  display: flex;
  gap: 1rem;
}

/* 更新侧边栏卡片样式 */
.sidebar-card {
  width: 200px;
  height: 300px;
  border: 1px solid #e0f2fe; /* 淡蓝色边框 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(147, 197, 253, 0.2); /* 淡蓝色阴影 */
  padding: 16px;
  box-sizing: border-box;
  background: #f8fafc; /* 非常淡的背景色 */
}

/* 更新列表项悬停效果 */
.sidebar-card li {
  background-color: #f0f9ff; /* 淡蓝色背景 */
  transition: all 0.2s ease;
}

.sidebar-card li:hover {
  background-color: #e0f2fe; /* 稍深的淡蓝色 */
  transform: translateX(3px);
}

/* 更新标题样式 */
.sidebar-card h3 {
  color: #0369a1; /* 深蓝色标题 */
  border-bottom-color: #bae6fd; /* 淡蓝色下划线 */
}

/* 更新小圆点颜色 */
.left-sidebar .sidebar-card li span {
  background-color: #38bdf8; /* 亮蓝色圆点 */
}

.right-sidebar .sidebar-card li span {
  background-color: #4ade80; /* 保持绿色圆点 */
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
}

.tab-button.active {
  background: #3b82f6;
  color: white;
}

.tab-button:hover:not(.active) {
  background: #f3f4f6;
}

.news-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
}

/* 精选新闻样式 */
.featured-news {
  height: fit-content;
}

.featured-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.featured-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
}

.news-category {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.featured-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.featured-desc {
  opacity: 0.9;
  margin-bottom: 1rem;
}

.news-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 新闻列表样式 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: 1px solid #f3f4f6;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.news-item-content {
  flex: 1;
}

.news-item-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.news-item-desc {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.news-item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.news-item-category {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.news-item-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

/* 排行榜样式 */
.news-ranking {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.neutral-light { color: #f8fafc; } /* 背景 */

.neutral-dark { color: #1e293b; } /* 文字 */

.ranking-card, .tags-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.ranking-title, .tags-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3b82f6;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.ranking-item:hover {
  background: #f8fafc;
}

.ranking-number {
  width: 24px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.rank-1 .ranking-number {
  background: #f59e0b;
  color: white;
}

.rank-2 .ranking-number {
  background: #6b7280;
  color: white;
}

.rank-3 .ranking-number {
  background: #92400e;
  color: white;
}

.ranking-content {
  flex: 1;
}

.ranking-title-text {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.ranking-views {
  font-size: 0.75rem;
  color: #6b7280;
}

/* 标签云样式 */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  transition: transform 0.3s;
}

.tag:hover {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .news-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .featured-news {
    order: 1;
  }

  .news-list {
    order: 2;
  }

  .news-ranking {
    order: 3;
  }

  .news-header {
    flex-direction: column;
    gap: 1rem;
    align-items: start;
  }

  .news-tabs {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
  }

  .news-item-image {
    width: 100%;
    height: 200px;
  }
}
</style>