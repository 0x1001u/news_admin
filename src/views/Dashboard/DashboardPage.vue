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
import { newsService } from '../../services/news';
import { userService } from '../../services/users';
import { commentService } from '../../services/comments';

const newsCount = ref(0);
const userCount = ref(0);
const commentCount = ref(0);

onMounted(async () => {
    try {
        // 尝试获取新闻总数 (通过获取列表并取长度，如果后端没有专门的 /counts 接口)
        const newsList = await newsService.getNews({ limit: 1 }); // 只需要一条数据来获取总数，或者后端有 total_count 字段
        newsCount.value = newsList.total_count !== undefined ? newsList.total_count : newsList.length;

        // 尝试获取用户总数
        const userList = await userService.getUsers({ limit: 1 });
        userCount.value = userList.total_count !== undefined ? userList.total_count : userList.length;

        // 尝试获取评论总数
        const commentList = await commentService.getComments({ limit: 1 });
        commentCount.value = commentList.total_count !== undefined ? commentList.total_count : commentList.length;

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // 如果获取失败，可以保留为0或者显示一个错误提示
        newsCount.value = 'N/A';
        userCount.value = 'N/A';
        commentCount.value = 'N/A';
    }
});
</script>

<style scoped>
/* Scoped styles for DashboardPage */
</style>

