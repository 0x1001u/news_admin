<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">仪表盘</h2>
        <p class="text-gray-600">欢迎来到新闻资讯平台管理后台！</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <el-card class="text-center">
                <div class="text-4xl font-bold text-teal-600">{{ newsCount }}</div>
                <div class="text-gray-500 mt-2">新闻总数</div>
            </el-card>
            <el-card class="text-center">
                <div class="text-4xl font-bold text-blue-600">{{ userCount }}</div>
                <div class="text-gray-500 mt-2">注册用户</div>
            </el-card>
            <el-card class="text-center">
                <div class="text-4xl font-bold text-purple-600">{{ commentCount }}</div>
                <div class="text-gray-500 mt-2">评论总数</div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// In a real application, you would import your API services here
// import { getNewsCount } from '../../services/news';
// import { getUserCount } from '../../services/users';
// import { getCommentCount } from '../../services/comments';

// Mock data for demonstration
const newsCount = ref(150);
const userCount = ref(500);
const commentCount = ref(320);

onMounted(async () => {
    // In a real application, fetch actual counts from your backend
    // try {
    //     const newsRes = await getNewsCount();
    //     newsCount.value = newsRes.data.count;
    //     const userRes = await getUserCount();
    //     userCount.value = userRes.data.count;
    //     const commentRes = await getCommentCount();
    //     commentCount.value = commentRes.data.count;
    // } catch (error) {
    //     console.error("Failed to fetch dashboard data:", error);
    // }
});
</script>

<style scoped>
/* Scoped styles for DashboardPage */
</style>

