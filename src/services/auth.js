import ApiClient from './core/ApiClient';
import { deleteCookie } from '../utils/cookie';

export const authService = {
    /**
     * 用户登录。
     * @param {string} username - 用户名或邮箱。
     * @param {string} password - 密码。
     * @returns {Promise<object>} - 包含用户信息的响应。
     */
    async login(username, password) {
        // 开发环境使用环境变量验证
        if (import.meta.env.MODE === 'development') {
            const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
            const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
            
            if (username === envUsername && password === envPassword) {
                return {
                    user: {
                        id: 1,
                        username: envUsername,
                        role: 'admin'
                    }
                };
            }
            throw new Error('Invalid credentials');
        }
        
        // 生产环境使用API
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await ApiClient.post('/auth/login', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    /**
     * 用户登出。
     * @returns {Promise<void>}
     */
    async logout() {
        // 使用新的API客户端调用登出接口
        await ApiClient.post('/auth/logout');

        // 清除非 HttpOnly cookies
        deleteCookie('user_info');
    },

    /**
     * 获取当前用户信息。
     * @returns {Promise<object>} - 当前用户的详细信息。
     */
    async getMe() {
        const response = await ApiClient.get('/users/me');
        return response.data;
    },

    /**
     * 用户注册。
     * @param {object} userData - 注册用户信息，包含 username, email, password。
     * @returns {Promise<object>}
     */
    async register(userData) {
        const response = await ApiClient.post('/auth/register', userData);
        return response.data;
    },

    // 更多认证相关服务，如请求密码重置、重置密码等
};
