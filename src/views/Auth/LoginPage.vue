<template>
  <div class="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-zinc-800 rounded-lg shadow-xl p-8 space-y-6">
      <!-- Logo / Title -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white">管理后台登录</h2>
        <p class="mt-2 text-gray-400">请输入您的账号信息以继续</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-1">邮箱地址</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="admin@example.com"
            class="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-1">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center text-sm text-gray-400">
            <input type="checkbox" class="mr-2 bg-zinc-700 border-zinc-600 rounded text-red-500" />
            记住我
          </label>
          <a href="#" class="text-sm text-red-400 hover:text-red-300">忘记密码？</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          登录
        </button>
      </form>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        © {{ new Date().getFullYear() }} 管理后台. All rights reserved.
      </div>
    </div>
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
    email: '', // 默认值方便测试
    password: '' // 默认值方便测试
});

const handleLogin = async () => {
    try {
        const response = await apiClient.post('/auth/login', new URLSearchParams({
            email: form.email,
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
