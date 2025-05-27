<template>
    <div class="p-6 bg-gray-900 min-h-screen text-gray-50">
        <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl mb-6">
            <div class="flex flex-col md:flex-row items-center justify-between p-4">
                <div class="flex items-center mb-4 md:mb-0">
                    <img src="https://placehold.co/60x60/DC2626/FFFFFF?text=JS" alt="User Avatar" class="rounded-full mr-4 border-2 border-primary-500">
                    <div>
                        <h2 class="text-2xl font-bold text-primary-500">欢迎回来, {{ authStore.user?.full_name || authStore.user?.username || '用户' }}</h2>
                        <p class="text-gray-400">仪表盘 / 概览</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-right">
                        <p class="text-3xl font-bold text-primary-500">¥ 2,340</p>
                        <p class="text-gray-400 text-sm">今日销售额</p>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-bold text-green-400">35% <span class="text-sm">▲</span></p>
                        <p class="text-gray-400 text-sm">按昨日</p>
                    </div>
                    <div class="w-24 h-16 bg-gray-700 rounded-md flex items-center justify-center text-gray-500 text-xs">
                        [小图表]
                    </div>
                </div>
            </div>
        </el-card>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <el-card class="text-center !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl">
                <div class="text-4xl font-bold text-primary-500">{{ newsCount }}</div>
                <div class="text-gray-300 mt-2">新闻总数</div>
            </el-card>
            <el-card class="text-center !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl">
                <div class="text-4xl font-bold text-primary-500">{{ userCount }}</div>
                <div class="text-gray-300 mt-2">注册用户</div>
            </el-card>
            <el-card class="text-center !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl">
                <div class="text-4xl font-bold text-primary-500">{{ commentCount }}</div>
                <div class="text-gray-300 mt-2">评论总数</div>
            </el-card>
            <el-card class="text-center !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl">
                <div class="text-4xl font-bold text-primary-500">12345</div>
                <div class="text-gray-300 mt-2">总浏览量</div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <el-card class="!bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl p-6">
                <h3 class="text-xl font-semibold text-gray-200 mb-4">销售趋势</h3>
                <p class="text-gray-400 text-sm mb-4">月度销售对比</p>
                <div class="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                    [销售趋势图表]
                </div>
            </el-card>
            <el-card class="!bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl p-6">
                <h3 class="text-xl font-semibold text-gray-200 mb-4">销售分类</h3>
                <p class="text-gray-400 text-sm mb-4">按产品类别</p>
                <div class="flex items-center justify-around h-64">
                    <div class="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                        [分类图表]
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-primary-500">¥ 300,458</p>
                        <p class="text-gray-400 text-sm">总收入</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-green-400">¥ 130,580</p>
                        <p class="text-gray-400 text-sm">净利润</p>
                    </div>
                </div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <el-card class="!bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl p-6 lg:col-span-2">
                <h3 class="text-xl font-semibold text-gray-200 mb-4">热销商品</h3>
                <p class="text-gray-400 text-sm mb-4">按销售额排行</p>
                <div class="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                    [热销商品图表/列表]
                </div>
            </el-card>
            <el-card class="!bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-xl p-6">
                <h3 class="text-xl font-semibold text-gray-200 mb-4">最近活动</h3>
                <ul class="space-y-4 text-gray-300">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-2">
                        <div>
                            <p class="font-semibold text-primary-400">新订单 #38291</p>
                            <p class="text-sm text-gray-400">待处理</p>
                        </div>
                        <span class="text-xs text-gray-500">5分钟前</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-2">
                        <div>
                            <p class="font-semibold text-yellow-400">退款申请 #12845</p>
                            <p class="text-sm text-gray-400">处理中</p>
                        </div>
                        <span class="text-xs text-gray-500">10分钟前</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-2">
                        <div>
                            <p class="font-semibold text-blue-400">客户投诉处理</p>
                            <p class="text-sm text-gray-400">已解决</p>
                        </div>
                        <span class="text-xs text-gray-500">15分钟前</span>
                    </li>
                    <li class="flex justify-between items-center">
                        <div>
                            <p class="font-semibold text-red-400">库存不足提醒</p>
                            <p class="text-sm text-gray-400">紧急</p>
                        </div>
                        <span class="text-xs text-gray-500">20分钟前</span>
                    </li>
                </ul>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth'; // Import auth store

const authStore = useAuthStore(); // Use auth store to get user info

const newsCount = ref(0);
const userCount = ref(0);
const commentCount = ref(0);

const fetchDashboardData = async () => {
    try {
        // Fetch news count
        const newsResponse = await apiClient.get('/news/', { params: { limit: 1 } });
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
/* These are general overrides for el-card to ensure dark theme compatibility */
:deep(.el-card) {
  background-color: #1F2937 !important; /* Deeper gray for card background */
  border-color: #374151 !important; /* Slightly lighter border for contrast */
  color: #E5E7EB !important; /* Light text for readability */
}

/* Specific styling for the welcome section avatar */
img.rounded-full {
    object-fit: cover;
}
</style>

