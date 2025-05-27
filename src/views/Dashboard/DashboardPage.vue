<template>
    <div class="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h2 class="text-2xl font-bold text-primary-500 mb-4">仪表盘</h2>
        <p class="text-gray-300 mb-6">欢迎来到新闻资讯平台管理后台！</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <el-card class="text-center !bg-gray-700 !border-gray-600 !text-gray-50 rounded-lg shadow-md">
                <div class="text-4xl font-bold text-primary-500">{{ newsCount }}</div>
                <div class="text-gray-300 mt-2">新闻总数</div>
            </el-card>
            <el-card class="text-center !bg-gray-700 !border-gray-600 !text-gray-50 rounded-lg shadow-md">
                <div class="text-4xl font-bold text-blue-400">{{ userCount }}</div>
                <div class="text-gray-300 mt-2">注册用户</div>
            </el-card>
            <el-card class="text-center !bg-gray-700 !border-gray-600 !text-gray-50 rounded-lg shadow-md">
                <div class="text-4xl font-bold text-purple-400">{{ commentCount }}</div>
                <div class="text-gray-300 mt-2">评论总数</div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端
import { ElMessage } from 'element-plus';

const newsCount = ref(0);
const userCount = ref(0);
const commentCount = ref(0);

const fetchDashboardData = async () => {
    try {
        // Fetch news count
        const newsResponse = await apiClient.get('/news/', { params: { limit: 1 } }); // Fetch one to get total count from header
        newsCount.value = parseInt(newsResponse.headers['x-total-count'] || 0);

        // Fetch user count
        const usersResponse = await apiClient.get('/users/', { params: { limit: 1 } });
        userCount.value = parseInt(usersResponse.headers['x-total-count'] || 0);

        // Fetch comment count
        const commentsResponse = await apiClient.get('/comments/', { params: { limit: 1 } });
        commentCount.value = parseInt(commentsResponse.headers['x-total-count'] || 0);

    } catch (error) {
        ElMessage.error('获取仪表盘数据失败！');
        console.error('Failed to fetch dashboard data:', error);
    }
};

onMounted(() => {
    fetchDashboardData();
});
</script>

<style scoped>
/* Element Plus 卡片在暗色模式下的样式覆盖 */
:deep(.el-card) {
  background-color: #1F2937 !important; /* bg-gray-800 */
  border-color: #374151 !important; /* border-gray-700 */
  color: #E5E7EB !important; /* text-gray-50 */
}
</style>

