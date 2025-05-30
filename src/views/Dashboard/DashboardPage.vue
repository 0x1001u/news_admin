<template>
    <div class="p-8 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-extrabold text-primary-500 mb-2">仪表盘</h1>
                <p class="text-gray-400">欢迎来到新闻资讯平台管理后台！</p>
            </div>
            <el-button
                type="danger"
                @click="handleLogout"
                class="!bg-red-600 hover:!bg-red-700 !border-red-600">
                退出登录
            </el-button>
        </div>
        
        <el-skeleton v-if="isLoading" animated />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <el-card class="text-center bg-gray-800 border-gray-700 text-gray-100 rounded-xl shadow-lg">
                <div class="flex items-center justify-center mb-2">
                    <el-icon class="text-5xl text-primary-500 mr-2"><Document /></el-icon>
                    <span class="text-4xl font-extrabold text-primary-500">{{ newsCount }}</span>
                </div>
                <div class="text-gray-400">新闻总数</div>
            </el-card>
            <el-card class="text-center bg-gray-800 border-gray-700 text-gray-100 rounded-xl shadow-lg">
                <div class="flex items-center justify-center mb-2">
                    <el-icon class="text-5xl text-blue-400 mr-2"><User /></el-icon>
                    <span class="text-4xl font-extrabold text-blue-400">{{ userCount }}</span>
                </div>
                <div class="text-gray-400">注册用户</div>
            </el-card>
            <el-card class="text-center bg-gray-800 border-gray-700 text-gray-100 rounded-xl shadow-lg">
                <div class="flex items-center justify-center mb-2">
                    <el-icon class="text-5xl text-purple-400 mr-2"><ChatDotRound /></el-icon>
                    <span class="text-4xl font-extrabold text-purple-400">{{ commentCount }}</span>
                </div>
                <div class="text-gray-400">评论总数</div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../../services/api';
import { ElMessage } from 'element-plus';
import { Document, User, ChatDotRound } from '@element-plus/icons-vue';
import { getToken } from '../../utils/cookie';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const newsCount = ref(0);
const userCount = ref(0);
const commentCount = ref(0);
const isLoading = ref(true);

const loadData = async () => {
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
        if (error.response?.status === 401) {
            console.error('认证过期，请重新登录');
        } else {
            console.error('数据获取失败，请重试', error);
            ElMessage.error('获取仪表盘数据失败！');
        }
    }
};

// 仅在用户主动登出时调用
const handleLogout = () => {
    authStore.logout();
    router.push({ name: 'Login' });
};

onMounted(async () => {
    if (!getToken()) {
        router.push({ name: 'Login' });
    } else {
        await loadData();
    }
    isLoading.value = false;
});
</script>

<style scoped>
/* Element Plus 卡片在暗色模式下的样式覆盖 */
:deep(.el-card) {
  background-color: #111827 !important; /* bg-gray-900 */
  border-color: #2d3748 !important; /* border-gray-800 */
  color: #f9fafb !important; /* text-gray-100 */
}

/* 确保卡片内容的样式 */
:deep(.el-card__body) {
  padding: 1.5rem; /* p-6 */
}
</style>
