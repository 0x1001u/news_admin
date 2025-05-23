import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ElMessage } from 'element-plus';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout.vue';

// Import Views
import LoginPage from '../views/Auth/LoginPage.vue';
import DashboardPage from '../views/Dashboard/DashboardPage.vue';
import UserListPage from '../views/Users/UserListPage.vue';
import UserFormPage from '../views/Users/UserFormPage.vue';
import NewsListPage from '../views/News/NewsListPage.vue';
import NewsFormPage from '../views/News/NewsFormPage.vue';
import CategoryListPage from '../views/Categories/CategoryListPage.vue';
import CategoryFormPage from '../views/Categories/CategoryFormPage.vue';
import TagListPage from '../views/Tags/TagListPage.vue';
import TagFormPage from '../views/Tags/TagFormPage.vue';
import CommentListPage from '../views/Comments/CommentListPage.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { public: true, hideForAuth: true }
    },
    {
        path: '/',
        component: AdminLayout,
        redirect: '/dashboard',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: DashboardPage,
                meta: { requiresAuth: true }
            },
            {
                path: 'users',
                name: 'UserList',
                component: UserListPage,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'users/new',
                name: 'UserCreate',
                component: UserFormPage,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'users/edit/:id',
                name: 'UserEdit',
                component: UserFormPage,
                props: true,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'news',
                name: 'NewsList',
                component: NewsListPage,
                meta: { requiresAuth: true }
            },
            {
                path: 'news/new',
                name: 'NewsCreate',
                component: NewsFormPage,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'news/edit/:id',
                name: 'NewsEdit',
                component: NewsFormPage,
                props: true,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'categories',
                name: 'CategoryList',
                component: CategoryListPage,
                meta: { requiresAuth: true }
            },
            {
                path: 'categories/new',
                name: 'CategoryCreate',
                component: CategoryFormPage,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'categories/edit/:id',
                name: 'CategoryEdit',
                component: CategoryFormPage,
                props: true,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'tags',
                name: 'TagList',
                component: TagListPage,
                meta: { requiresAuth: true }
            },
            {
                path: 'tags/new',
                name: 'TagCreate',
                component: TagFormPage,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'tags/edit/:id',
                name: 'TagEdit',
                component: TagFormPage,
                props: true,
                meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
                path: 'comments',
                name: 'CommentList',
                component: CommentListPage,
                meta: { requiresAuth: true }
            },
        ]
    },
    // Catch-all route for 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/dashboard' // Redirect to dashboard for unknown routes
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    // 直接从 localStorage 获取 token 和 user_info，以确保获取到最新状态，避免时序问题
    const tokenInLocalStorage = localStorage.getItem('jwt_token');
    const userInLocalStorageRaw = localStorage.getItem('user_info');
    let userInLocalStorage = null;
    try {
        if (userInLocalStorageRaw && userInLocalStorageRaw !== 'undefined') {
            userInLocalStorage = JSON.parse(userInLocalStorageRaw);
        }
    } catch (e) {
        console.error("Error parsing user_info from localStorage:", e);
        // 如果解析失败，清除本地存储以避免持续错误
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_info');
        // 确保 authStore 状态也同步清除
        authStore.logout(); // 调用 logout 会触发路由跳转到 /login
        ElMessage.error('认证信息已损坏，请重新登录。');
        return next('/login');
    }

    // isAuthenticated 的判断现在完全依赖于 localStorage 的实际内容
    const isAuthenticated = !!tokenInLocalStorage && !!userInLocalStorage;
    
    // isAdmin 的判断也依赖于从 localStorage 获取到的 user 对象
    const isAdmin = isAuthenticated && userInLocalStorage && userInLocalStorage.is_superuser;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 如果路由需要认证但用户未认证，则重定向到登录页
        ElMessage.warning('请先登录以访问此页面。');
        next('/login');
    } else if (to.meta.requiresAdmin && !isAdmin) {
        // 如果路由需要管理员权限但用户不是管理员，则重定向到仪表盘
        ElMessage.warning('您没有权限访问此页面。');
        next('/dashboard');
    } else if (to.meta.hideForAuth && isAuthenticated) {
        // 如果路由在认证用户下应隐藏（如登录页），则重定向到仪表盘
        next('/dashboard');
    } else {
        // 否则，正常进行导航
        next();
    }
});

export default router;

