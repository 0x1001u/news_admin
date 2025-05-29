import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import router from '../router';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null, // 统一使用user状态管理
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: (state) => state.user?.is_superuser || false,
    },
    actions: {
        // 初始化时从cookie加载用户状态
        initialize() {
            try {
                const storedUser = getCookie('user_info');
                if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                    this.user = JSON.parse(storedUser);
                }
                // 调试日志：输出token值
                const token = getCookie('token');
                console.log('初始化token:', token);
            } catch (error) {
                console.error('用户信息解析失败:', error);
                this.user = null;
                deleteCookie('user_info');
            }
        },
        
        // 统一登录和用户设置逻辑
        login(userData, token) {
            try {
                this.user = userData;
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
            deleteCookie('user_info');
            deleteCookie('token'); // 删除token cookie
            ElMessage.info('您已登出。');
            router.push('/login');
        }
    },
});
