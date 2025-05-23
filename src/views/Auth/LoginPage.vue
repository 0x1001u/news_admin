<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <el-card class="w-full max-w-sm p-6 shadow-lg rounded-lg">
            <template #header>
                <div class="text-center text-2xl font-bold text-teal-700">管理后台登录</div>
            </template>
            <el-form @submit.prevent="handleLogin">
                <el-form-item label="用户名/邮箱">
                    <el-input v-model="form.username" placeholder="请输入用户名或邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="w-full">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
// ElMessage 不再在此处直接调用 success 消息
import { authService } from '../../services/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
    username: '', // 假设后端登录使用邮箱或用户名
    password: ''
});

const handleLogin = async () => {
    try {
        const response = await authService.login(form.username, form.password);
        // 假设后端返回的数据结构包含 access_token 和 user 字段
        authStore.login(response.access_token, response.user);
        
        // 移除此处重复的 ElMessage.success('登录成功！'); 调用，因为它已在 authStore.login 中处理。

        // 使用 nextTick 确保 Pinia 状态更新和 localStorage 写入完成后，
        // 再触发路由跳转，给 navigation guard 足够的时间来读取最新的状态。
        await nextTick(); 
        router.push('/dashboard');

    } catch (error) {
        // 错误处理已在 apiClient 拦截器中，这里可以添加更具体的登录失败提示
        console.error('登录失败:', error);
        // 如果需要，可以在这里添加 ElMessage.error('登录失败，请检查用户名或密码。');
    }
};
</script>

<style scoped>
/* Scoped styles for LoginPage */
</style>

