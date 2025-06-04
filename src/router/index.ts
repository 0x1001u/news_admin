import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由规则
const routes: Array<RouteRecordRaw> = [
  // 根路径重定向到登录页
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { requiresAuth: false, authType: 'login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/index.vue'),
    meta: { requiresAuth: false, authType: 'register' }
  },
  {
    path: '/',
    name: 'MainLayout',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/Users/UserList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'users/create',
        name: 'UserCreate',
        component: () => import('@/views/Users/UserForm.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'users/edit/:id',
        name: 'UserEdit',
        component: () => import('@/views/Users/UserForm.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
        props: true
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories/CategoryList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/create',
        name: 'CategoryCreate',
        component: () => import('@/views/Categories/CategoryForm.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'editor'] }
      },
      {
        path: 'categories/create/:parentId',
        name: 'CategoryCreateChild',
        component: () => import('@/views/Categories/CategoryForm.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin', 'editor'] }
      },
      {
        path: 'categories/edit/:id',
        name: 'CategoryEdit',
        component: () => import('@/views/Categories/CategoryForm.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin', 'editor'] }
      },
      // 新闻管理路由
      {
        path: 'news',
        name: 'NewsList',
        component: () => import('@/views/News/NewsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'news/create',
        name: 'NewsCreate',
        component: () => import('@/views/News/NewsForm.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'editor'] }
      },
      {
        path: 'news/edit/:id',
        name: 'NewsEdit',
        component: () => import('@/views/News/NewsForm.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin', 'editor'] }
      },
      {
        path: 'news/:id',
        name: 'NewsDetail',
        component: () => import('@/views/News/NewsDetail.vue'),
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/Tags/TagList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tags/create',
        name: 'TagCreate',
        component: () => import('@/views/Tags/TagForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tags/edit/:id',
        name: 'TagEdit',
        component: () => import('@/views/Tags/TagForm.vue'),
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: 'comments',
        name: 'CommentList',
        component: () => import('@/views/Comments/CommentList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'comments/:id',
        name: 'CommentDetail',
        component: () => import('@/views/Comments/CommentDetail.vue'),
        meta: { requiresAuth: true },
        props: true
      }
    ]
  },
  // 404处理
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'  // 保持404重定向到仪表盘
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 确保用户状态是最新的
  if (!authStore.userData && authStore.token) {
    await authStore.fetchUser()
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && authStore.userData?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router