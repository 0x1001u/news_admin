<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-950 transition-colors duration-300" >
        <el-card class="w-full max-w-sm p-8 shadow-2xl rounded-xl !bg-gray-800 !border-gray-700" style="position: absolute; left: 49%; top: 50%; transform: translate(-50%,-50%); border-radius: 10px; border: 2px solid rgba(255,255,255,0.1);">
            <template #header>
                <div class="text-center text-3xl font-bold text-gray-100 mb-4">Login Here</div>
            </template>
            <el-form @submit.prevent="handleLogin" label-position="top">
                <el-form-item label="Username" class="!text-gray-300">
                    <el-input v-model="form.username" placeholder="Email or Phone" class="!bg-gray-700 !text-gray-50 rounded-md"></el-input>
                </el-form-item>
                <el-form-item label="Password" class="!text-gray-300">
                    <el-input type="password" v-model="form.password" placeholder="Password" show-password class="!bg-gray-700 !text-gray-50 rounded-md"></el-input>
                </el-form-item>
                <el-form-item class="mt-8">
                    <el-button type="default" native-type="submit" class="w-full !bg-white !text-gray-900 !border-white hover:!bg-gray-100 hover:!text-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-gray-900 !font-semibold !py-3 !rounded-md">Log In</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import apiClient from '../../services/api';
import { setCookie } from '../../utils/cookie'; // 添加setCookie导入
import { userService } from '../../services/users'; // 导入userService


const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    username: 'admin', // 测试用默认值
    password: 'adminpass' // 测试用默认值
});

const handleLogin = async () => {
    try {
        // 添加请求参数日志
        console.log('[Login] Request payload:', { username: form.username, password: form.password });
        
        const response = await apiClient.post('/api/v1/auth/login', new URLSearchParams({
            username: form.username,
            password: form.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('[Login] Full response:', response);
        // 存储token到cookie
        const token = response.data.access_token;
        setCookie('token', token, 7);
        console.log('登录成功，token:', token); // 调试日志
        console.log('[Login] Response data:', response.data);
        console.log('[Login] Set token:', response.data.access_token);

        // 使用新的login API - 传递完整用户对象
        authStore.login(response.data.user, token); // 存储完整用户对象
        const userId = response.data.user.id; // 获取用户ID

        // 使用新的用户信息获取端点
        const userInfo = await userService.getUser(userId);
        console.log('[Login] User info:', userInfo);

        router.push('/dashboard');
    } catch (error) {
        console.error('登录失败:', error);
        console.error('[Login] Full error details:', error.toJSON());
    }
};
</script>

<style scoped>
/* Override Element Plus card and form components styles for dark mode */

:deep(.el-card) {
  background-color: #1F2937 !important; /* Matches image's card background (dark gray) */
  border-color: #374151 !important; /* Slightly lighter border for contrast */
  color: #E5E7EB !important; /* Light text for readability */
}

:deep(.el-form-item__label) {
    color: #D1D5DB !important; /* Lighter gray for labels */
    font-weight: 600; /* Make labels bold */
    margin-bottom: 0.5rem; /* Add some space below labels */
}

:deep(.el-input__wrapper) {
    background-color: #374151 !important; /* Darker background for input fields */
    box-shadow: none !important;
    border: 1px solid #4B5563 !important; /* Border color for input fields */
    border-radius: 0.375rem !important; /* Rounded corners for inputs */
    padding: 0.75rem 1rem !important; /* Adjust padding for input fields */
    height: auto !important; /* Allow height to adjust based on content */
}

:deep(.el-input__inner) {
    color: #E5E7EB !important; /* Light text color for input values */
}

:deep(.el-input__inner::placeholder) {
    color: #9CA3AF !important; /* Lighter placeholder text color */
}

/* Ensure button styles are correct */
:deep(.el-button--default) {
    --el-button-bg-color: #FFFFFF; /* White background for the button */
    --el-button-hover-bg-color: #F3F4F6; /* Light gray on hover */
    --el-button-active-bg-color: #E5E7EB; /* Even lighter gray on active */
    --el-button-border-color: #FFFFFF; /* White border */
    --el-button-hover-border-color: #F3F4F6;
    --el-button-active-border-color: #E5E7EB;
    --el-button-text-color: #1F2937; /* Dark text color for the button */
    font-weight: 600; /* Bold text for the button */
    padding-top: 0.75rem; /* py-3 */
    padding-bottom: 0.75rem; /* py-3 */
    border-radius: 0.375rem; /* rounded-md */
}
</style>
