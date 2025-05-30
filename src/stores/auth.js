import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import router from '../router';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';
import apiClient from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null, // 统一使用user状态管理
        userId: null // 新增用户ID存储
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: (state) => state.user?.is_superuser || false,
    },
    actions: {
        // 初始化时从cookie加载用户状态
        async initialize() {
            try {
                const storedUser = getCookie('user_info');
                if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                    this.user = JSON.parse(storedUser);
                }
                // 调试日志：输出token值
                const token = getCookie('token');
                console.log('初始化token:', token);
                
                // 如果token存在但用户信息不存在，则获取当前用户信息
                if (token && !this.user) {
                    await this.fetchCurrentUser();
                }
            } catch (error) {
                console.error('用户信息解析失败:', error);
                this.user = null;
                deleteCookie('user_info');
            }
        },
        
        // 从API获取当前用户信息
        async fetchCurrentUser() {
            try {
                const response = await apiClient.get('/api/v1/users/me');
                if (response.data) {
                    this.user = response.data;
                    setCookie('user_info', JSON.stringify(response.data), 7);
                    console.log('成功获取用户信息:', response.data);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
            }
        },
        
        // 统一登录和用户设置逻辑
        login(userData, token) {
            try {
                this.user = userData;
                this.userId = userData.id; // 存储用户ID
                setCookie('user_info', JSON.stringify(userData), 7);
                setCookie('token', token, 7); // 存储token
                console.log('登录成功，存储的token:', token); // 调试日志
            } catch (error) {
                console.error('登录状态保存失败:', error);
                ElMessage.error('登录状态保存失败');
            }
        },
        
        logout() {
            this.user = null;
            this.userId = null; // 清除用户ID
            deleteCookie('user_info');
            deleteCookie('token'); // 删除token cookie
            ElMessage.info('您已登出。');
            router.push('/login');
        }
    },
});
