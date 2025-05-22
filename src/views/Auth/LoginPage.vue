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
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { ElMessage } from 'element-plus';
import apiClient from '../../services/api'; // Assuming you'll use this for actual API calls

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
    username: 'admin', // Default for easy testing
    password: 'adminpass' // Default for easy testing
});

const handleLogin = async () => {
    try {
        // In a real application, replace this mock login with an actual API call:
        // const response = await apiClient.post('/auth/login', { username: form.username, password: form.password });
        // const { access_token, user_info } = response.data; // Adjust based on your backend response structure
        // authStore.login(access_token, user_info);

        // Mock login logic:
        if (form.username === 'admin' && form.password === 'adminpass') {
            const mockToken = 'mock_admin_jwt_token';
            const mockUser = { id: 1, username: 'admin', email: 'admin@example.com', is_superuser: true, is_active: true };
            authStore.login(mockToken, mockUser);
            router.push('/dashboard');
        } else if (form.username === 'user1' && form.password === 'userpass') {
            const mockToken = 'mock_user_jwt_token';
            const mockUser = { id: 2, username: 'user1', email: 'user1@example.com', is_superuser: false, is_active: true };
            authStore.login(mockToken, mockUser);
            router.push('/dashboard');
        } else {
            ElMessage.error('用户名或密码错误！');
        }
    } catch (error) {
        // Error handling is already in apiClient interceptors, but can add specific login error handling here if needed.
        console.error('Login error:', error);
    }
};
</script>

<style scoped>
/* Scoped styles for LoginPage */
</style>

