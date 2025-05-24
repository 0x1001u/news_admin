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
import { ElMessage } from 'element-plus';
import { authService } from '../../services/auth';
import { userService } from '../../services/users'; // 导入 userService 来获取用户详情

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
    username: 'admin@example.com', // 假设后端登录使用邮箱或用户名
    password: 'adminpass'
});

const handleLogin = async () => {
    try {
        // 1. 调用后端登录接口获取 token
        // 假设后端登录接口返回的数据结构是 { access_token: "...", token_type: "bearer" }
        const loginResponse = await authService.login(form.username, form.password);
        const accessToken = loginResponse.access_token;

        // 2. 将 token 临时保存到 localStorage，以便后续的 getMe 请求能带上认证信息
        // 注意：authStore.setToken 也会更新 Pinia 状态和 localStorage
        authStore.setToken(accessToken);

        // 3. 使用获取到的 token 调用 /users/me 接口获取完整的用户详情
        const userDetails = await userService.getMe();

        // 4. 将 token 和完整的用户详情保存到 Pinia Store
        authStore.login(accessToken, userDetails); // authStore.login 内部会处理 ElMessage.success

        // 确保 Pinia 状态更新和 localStorage 写入完成后，再触发路由跳转
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

