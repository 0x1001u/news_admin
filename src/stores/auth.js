import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import router from '../router'; // Import router for redirection
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';

export const useAuthStore = defineStore('auth', {
    state: () => {
        const storedUser = getCookie('user_info');
        return {
            // Token now stored in HttpOnly cookie, not accessible via JS
            token: null, // This will be null as HttpOnly cookies can't be accessed
            // 只有当 storedUser 是一个非空字符串时才尝试解析 JSON
            user: storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null,
        };
    },
    getters: {
        isAuthenticated: (state) => !!state.user, // Only check user since token is in HttpOnly cookie
        isAdmin: (state) => state.user && state.user.is_superuser,
    },
    actions: {
        setUser(user) {
            this.user = user;
            // 确保只存储有效的用户对象，如果 user 为 null，则移除 'user_info'
            if (user) {
                setCookie('user_info', JSON.stringify(user), 7); // Store for 7 days
            } else {
                deleteCookie('user_info');
            }
        },
        // login action 负责更新状态和存储，不负责显示消息
        login(user) {
            this.setUser(user);
            // ElMessage.success('登录成功！'); // 移除此行，由 LoginPage.vue 处理
        },
        logout() {
            this.user = null;
            deleteCookie('user_info'); // 确保移除 user_info
            ElMessage.info('您已登出。');
            router.push('/login'); // Redirect to login page on logout
        },
    },
});
