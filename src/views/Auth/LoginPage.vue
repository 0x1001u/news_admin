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
// 移除 userService 的导入，因为我们不再直接调用 getMe 或 getUser
// import { userService } from '../../services/users';
// 移除 decodeJwt 的导入，因为我们不再通过解码来获取用户ID
// import { decodeJwt } from '../../utils/helpers'; 

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
    username: 'admin@example.com', // 假设后端登录使用邮箱或用户名
    password: 'adminpass'
});

const handleLogin = async () => {
    try {
        // 1. 调用后端登录接口获取 token
        // 根据 API 文档，/auth/login 返回 { access_token: "...", token_type: "bearer" }
        const loginResponse = await authService.login(form.username, form.password);
        const accessToken = loginResponse.access_token;

        // 2. 由于 /users/me 接口问题，我们暂时模拟用户数据
        // 这个模拟数据需要包含 is_superuser 字段，因为路由守卫会用到它
        const mockUser = {
            id: 999, // 模拟一个ID
            username: form.username,
            email: form.username, // 假设邮箱就是用户名
            full_name: '管理员用户',
            is_active: true,
            is_superuser: true, // 假设登录成功就是管理员
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // 3. 将 token 和模拟的用户详情保存到 Pinia Store
        authStore.login(accessToken, mockUser);
        
        ElMessage.success('登录成功！(用户数据已模拟)'); // 添加模拟提示

        // 确保 Pinia 状态更新和 localStorage 写入完成后，再触发路由跳转
        await nextTick(); 
        router.push('/dashboard');

    } catch (error) {
        console.error('登录失败:', error);
        // 确保错误消息是可读的
        if (error.response && error.response.data && error.response.data.detail) {
            // 如果后端返回了 detail 字段，尝试解析并显示
            const detail = error.response.data.detail;
            if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
                ElMessage.error(`登录失败: ${detail[0].msg}`);
            } else if (typeof detail === 'string') {
                ElMessage.error(`登录失败: ${detail}`);
            } else {
                ElMessage.error('登录失败，请检查用户名或密码。');
            }
        } else if (error.message) {
            ElMessage.error(`登录失败: ${error.message}`);
        } else {
            ElMessage.error('登录失败，请稍后再试。');
        }
    }
};
</script>

<style scoped>
/* Scoped styles for LoginPage */
</style>

