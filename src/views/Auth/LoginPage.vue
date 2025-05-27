<template>
    <div class="min-h-screen flex items-center justify-center bg-zinc-900 transition-colors duration-300">
        <el-card class="w-full max-w-md p-8 shadow-xl rounded-lg !bg-zinc-800 !border-zinc-700">
            <template #header>
                <div class="text-center text-2xl font-bold text-red-500">管理后台登录</div>
            </template>
            <el-form @submit.prevent="handleLogin" label-position="top">
                <el-form-item label="用户名/邮箱" class="!text-slate-200">
                    <el-input v-model="form.username" placeholder="请输入用户名或邮箱" class="!bg-zinc-700 !text-slate-200 transition-all duration-200 focus-within:scale-105"></el-input>
                </el-form-item>
                <el-form-item label="密码" class="!text-slate-200">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password class="!bg-zinc-700 !text-slate-200 transition-all duration-200 focus-within:scale-105"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="w-full font-bold transition-all duration-200 hover:scale-105">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth'; // 确保导入了 auth store
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    username: '', // 默认值方便测试
    password: '' // 默认值方便测试
});

const handleLogin = async () => {
    try {
        const response = await apiClient.post('/auth/login', new URLSearchParams({
            username: form.username,
            password: form.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, token_type } = response.data;

        // 获取用户信息
        const userResponse = await apiClient.get('/auth/me', {
            headers: {
                Authorization: `${token_type} ${access_token}`
            }
        });
        const user = userResponse.data;

        authStore.login(access_token, user);
        router.push('/dashboard');

    } catch (error) {
        // 错误已经在 apiClient 拦截器中处理，这里可以不做额外处理或仅用于调试
        console.error('Login failed:', error);
    }
};
</script>

<style scoped>
/* 覆盖 Element Plus 卡片和表单组件在暗色模式下的样式 */
:deep(.el-card) {
  background-color: #18181B !important; /* zinc-900 */
  border-color: #27272A !important; /* zinc-800 */
  color: #F4F4F5 !important; /* slate-50 */
}

:deep(.el-form-item__label) {
    color: #F4F4F5 !important; /* slate-50 */
}

:deep(.el-input__wrapper) {
    background-color: #27272A !important; /* zinc-800 */
    box-shadow: none !important;
    border: 1px solid #3F3F46 !important; /* zinc-700 */
    transition: all 0.2s;
}

:deep(.el-input__inner) {
    color: #F4F4F5 !important; /* slate-50 */
}

:deep(.el-input__inner::placeholder) {
    color: #9CA3AF !important; /* slate-400 */
}

/* 确保按钮样式正确 */
:deep(.el-button--primary) {
    --el-button-bg-color: #DC2626; /* red-600 */
    --el-button-hover-bg-color: #B91C1C; /* red-700 */
    --el-button-active-bg-color: #991B1B; /* red-800 */
    --el-button-border-color: #DC2626;
    --el-button-hover-border-color: #B91C1C;
    --el-button-active-border-color: #991B1B;
    --el-button-text-color: #ffffff;
}
</style>
