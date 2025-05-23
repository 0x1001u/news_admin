import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import router from '../router'; // Import router for redirection

export const useAuthStore = defineStore('auth', {
    state: () => {
        const storedUser = localStorage.getItem('user_info');
        return {
            token: localStorage.getItem('jwt_token') || null,
            // 只有当 storedUser 是一个非空字符串时才尝试解析 JSON
            user: storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null,
        };
    },
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        isAdmin: (state) => state.user && state.user.is_superuser,
    },
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('jwt_token', token);
        },
        setUser(user) {
            this.user = user;
            // 确保只存储有效的用户对象，如果 user 为 null，则移除 'user_info'
            if (user) {
                localStorage.setItem('user_info', JSON.stringify(user));
            } else {
                localStorage.removeItem('user_info');
            }
        },
        login(token, user) {
            this.setToken(token);
            this.setUser(user);
            ElMessage.success('登录成功！');
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_info'); // 确保移除 user_info
            ElMessage.info('您已登出。');
            router.push('/login'); // Redirect to login page on logout
        },
    },
});

