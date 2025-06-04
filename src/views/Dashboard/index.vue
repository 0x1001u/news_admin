<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    
    <!-- 关键指标卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.users }}</div>
        <div class="stat-label">用户数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.news }}</div>
        <div class="stat-label">新闻数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.comments }}</div>
        <div class="stat-label">评论数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.categories }}</div>
        <div class="stat-label">分类数</div>
      </el-card>
    </div>
    
    <!-- 最近活动列表 -->
    <el-card class="recent-activity">
      <h2>最近活动</h2>
      <el-table :data="activities" style="width: 100%">
        <el-table-column prop="user" label="用户" width="180" />
        <el-table-column prop="action" label="操作" width="180" />
        <el-table-column prop="target" label="对象" />
        <el-table-column prop="time" label="时间" width="200" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getDashboardStats, getRecentActivities } from '@/services/api'
import type { DashboardStats, Activity } from '@/types'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const stats = ref<DashboardStats>({
      users: 0,
      news: 0,
      comments: 0,
      categories: 0
    })
    
    const activities = ref<Activity[]>([])
    
    const fetchData = async () => {
      try {
        stats.value = await getDashboardStats()
        activities.value = await getRecentActivities()
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      }
    }
    
    onMounted(() => {
      fetchData()
    })
    
    return {
      stats,
      activities
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