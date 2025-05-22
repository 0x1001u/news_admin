import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import router from '../router'; // Import router for redirection

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('jwt_token') || null,
        user: JSON.parse(localStorage.getItem('user_info')) || null,
    }),
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
            localStorage.setItem('user_info', JSON.stringify(user));
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
            localStorage.removeItem('user_info');
            ElMessage.info('您已登出。');
            router.push('/login'); // Redirect to login page on logout
        },
    },
});

