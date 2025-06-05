<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    
    <!-- 关键指标卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.userCount }}</div>
        <div class="stat-label">用户数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.newsCount }}</div>
        <div class="stat-label">新闻数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.categoryCount }}</div>
        <div class="stat-label">分类数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.tagCount }}</div>
        <div class="stat-label">标签数</div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getDashboardStats } from '@/services/dashboard';
import type { DashboardStats } from '@/types';

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const stats = ref<DashboardStats>({
      userCount: 0,
      newsCount: 0,
      categoryCount: 0,
      tagCount: 0
    })
    
    const fetchData = async () => {
      try {
        stats.value = await getDashboardStats();
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      }
    }
    
    onMounted(() => {
      fetchData();
    })
    
    return {
      stats
    }
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
}

.recent-activity {
  margin-top: 20px;
}
</style>