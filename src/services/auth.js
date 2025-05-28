import apiClient from './api';
import { setCookie, deleteCookie } from '../utils/cookie';

export const authService = {
    /**
     * 用户登录。
     * @param {string} username - 用户名或邮箱。
     * @param {string} password - 密码。
     * @returns {Promise<object>} - 包含用户信息的响应。
     */
    async login(username, password) {
        // 您的后端登录接口可能需要 form-urlencoded 或 JSON 格式，
        // 请根据您的后端实际情况调整。这里假设是 form-urlencoded。
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        // 使用 apiClient 发送 POST 请求到后端登录接口
        const response = await apiClient.post('/auth/login', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // 后端会设置 HttpOnly cookie，我们只需要处理用户信息
        return response.data;
    },

    /**
     * 用户登出。
     * @returns {Promise<void>}
     */
    async logout() {
        // 假设后端有一个登出接口，用于使 JWT 失效（可选，如果后端使用黑名单机制）
        // 如果后端没有显式登出接口，前端清除本地 token 即可
        await apiClient.post('/auth/logout');

        // 清除非 HttpOnly cookies
        deleteCookie('user_info');
    },

    /**
     * 获取当前用户信息。
     * @returns {Promise<object>} - 当前用户的详细信息。
     */
    async getMe() {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    /**
     * 用户注册。
     * @param {object} userData - 注册用户信息，包含 username, email, password。
     * @returns {Promise<object>}
     */
    async register(userData) {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    // 更多认证相关服务，如请求密码重置、重置密码等
};
