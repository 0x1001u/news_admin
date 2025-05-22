import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { ElMessage } from 'element-plus';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000/api/v1', // 从环境变量读取后端地址
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加 JWT Token
apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Token 过期或无效，重定向到登录页
            const authStore = useAuthStore();
            authStore.logout(); // 清除本地 token 并重定向
        } else if (error.response && error.response.data && error.response.data.detail) {
            ElMessage.error(error.response.data.detail);
        } else {
            ElMessage.error('请求失败，请稍后再试。');
        }
        return Promise.reject(error);
    }
);

export default apiClient;

