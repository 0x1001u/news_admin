<template>
    <div class="flex h-screen bg-gray-100">
        <aside class="w-64 bg-gray-800 text-white flex flex-col">
            <div class="p-6 text-2xl font-semibold text-teal-400 border-b border-gray-700">管理后台</div>
            <el-menu
                default-active="dashboard"
                class="el-menu-vertical-demo flex-grow"
                background-color="#1f2937"
                text-color="#ffffff"
                active-text-color="#4ade80"
                :router="true"
            >
                <el-menu-item index="/dashboard">
                    <el-icon><Odometer /></el-icon>
                    <span>仪表盘</span>
                </el-menu-item>
                <el-menu-item index="/users" v-if="authStore.isAdmin">
                    <el-icon><User /></el-icon>
                    <span>用户管理</span>
                </el-menu-item>
                <el-menu-item index="/news">
                    <el-icon><Document /></el-icon>
                    <span>新闻管理</span>
                </el-menu-item>
                <el-menu-item index="/categories">
                    <el-icon><Folder /></el-icon>
                    <span>分类管理</span>
                </el-menu-item>
                <el-menu-item index="/tags">
                    <el-icon><PriceTag /></el-icon>
                    <span>标签管理</span>
                </el-menu-item>
                <el-menu-item index="/comments">
                    <el-icon><ChatDotRound /></el-icon>
                    <span>评论管理</span>
                </el-menu-item>
            </el-menu>
            <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
                <p>欢迎, {{ authStore.user?.username || '访客' }}</p>
                <el-button type="danger" size="small" @click="authStore.logout()" class="mt-2 w-full">登出</el-button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-sm p-4 flex items-center justify-between">
                <h1 class="text-xl font-semibold text-gray-700">新闻管理后台</h1>
            </header>
            <main class="flex-1 overflow-y-auto p-6">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { Odometer, User, Document, Folder, PriceTag, ChatDotRound } from '@element-plus/icons-vue'; // Import icons

const authStore = useAuthStore();

// Expose icons to the template
// In Vue 3 setup script, components imported are automatically available in template.
// No need to explicitly return them if using <script setup>.
</script>

<style scoped>
/* Scoped styles for AdminLayout */
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>

