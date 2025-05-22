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
            // Note: CommentDetailPage is not explicitly listed in core functions,
            // but if needed, it would follow a similar pattern:
            // { path: 'comments/:id', name: 'CommentDetail', component: CommentDetailPage, props: true, meta: { requiresAuth: true } },
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
    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // If route requires auth and user is not authenticated, redirect to login
        ElMessage.warning('请先登录以访问此页面。');
        next('/login');
    } else if (to.meta.requiresAdmin && !isAdmin) {
        // If route requires admin and user is not admin, redirect to dashboard
        ElMessage.warning('您没有权限访问此页面。');
        next('/dashboard');
    } else if (to.meta.hideForAuth && isAuthenticated) {
        // If route should be hidden for authenticated users (like login page), redirect to dashboard
        next('/dashboard');
    } else {
        next(); // Proceed to the route
    }
});

export default router;

