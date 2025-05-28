import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ElMessage } from 'element-plus';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout.vue';

// Lazy load views
const LoginPage = () => import('../views/Auth/LoginPage.vue');
const DashboardPage = () => import('../views/Dashboard/DashboardPage.vue');
const UserListPage = () => import('../views/Users/UserListPage.vue');
const UserFormPage = () => import('../views/Users/UserFormPage.vue');
const NewsListPage = () => import('../views/News/NewsListPage.vue');
const NewsFormPage = () => import('../views/News/NewsFormPage.vue');
const CategoryListPage = () => import('../views/Categories/CategoryListPage.vue');
const CategoryFormPage = () => import('../views/Categories/CategoryFormPage.vue');
const TagListPage = () => import('../views/Tags/TagListPage.vue');
const TagFormPage = () => import('../views/Tags/TagFormPage.vue');
const CommentListPage = () => import('../views/Comments/CommentListPage.vue');

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

    // Since token is now in HttpOnly cookie, we only need to check user info
    const isAuthenticated = !!authStore.user;
    const isAdmin = authStore.user && authStore.user.is_superuser;

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
