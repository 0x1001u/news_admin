<template>
    <div class="min-h-screen flex flex-col transition-colors duration-300" :class="{ 'dark': isDarkMode }">
        <header class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 text-gray-50 shadow-md">
            <div class="flex items-center">
                <h1 class="text-xl font-bold text-primary-500">新闻管理后台</h1>
                <button @click="toggleSidebar" class="ml-4 text-gray-400 hover:text-white focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            <div class="flex items-center space-x-4">
                <el-button @click="toggleDarkMode" :icon="darkModeIcon" circle class="!bg-gray-700 !border-gray-600 !text-gray-300 hover:!bg-gray-600 focus:outline-none">
                </el-button>
                <span class="text-gray-300">欢迎, {{ authStore.user?.username || '访客' }}</span>
                <el-button type="danger" @click="logout">退出</el-button>
            </div>
        </header>

        <div class="flex flex-1">
            <!-- Backdrop for mobile sidebar -->
            <div v-if="isSidebarOpen && !isLargeScreen" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>

            <aside :class="[
                'w-64',
                'bg-gray-900',
                'text-gray-200',
                'shadow-lg',
                'border-r',
                'border-gray-700',
                'transition-transform',
                'duration-300',
                'flex-shrink-0',
                {
                    'fixed inset-y-0 left-0 z-20': !isLargeScreen, /* Position absolutely when closed on mobile */
                    'translate-x-0': isSidebarOpen, /* Show on-screen when open */
                    '-translate-x-full': !isSidebarOpen, /* Hide off-screen when closed */
                    'relative': isLargeScreen /* On large screens, sidebar is always visible */
                }
            ]" class="md:flex md:flex-col">
                <nav class="p-4">
                    <el-menu
                        :default-active="$route.path"
                        class="el-menu-vertical-demo flex-grow !bg-gray-900 !border-r-0"
                        text-color="#ffffff"
                        active-text-color="#ffffff"
                        :router="true"
                    >
                        <el-menu-item index="/dashboard" :class="{'!bg-primary-700': $route.path === '/dashboard'}">
                            <el-icon><Odometer /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="/users" v-if="authStore.isAdmin" :class="{'!bg-primary-700': $route.path.startsWith('/users')}">
                            <el-icon><User /></el-icon>
                            <span>用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/news" :class="{'!bg-primary-700': $route.path.startsWith('/news')}">
                            <el-icon><Document /></el-icon>
                            <span>新闻管理</span>
                        </el-menu-item>
                        <el-menu-item index="/categories" :class="{'!bg-primary-700': $route.path.startsWith('/categories')}">
                            <el-icon><Folder /></el-icon>
                            <span>分类管理</span>
                        </el-menu-item>
                        <el-menu-item index="/tags" :class="{'!bg-primary-700': $route.path.startsWith('/tags')}">
                            <el-icon><PriceTag /></el-icon>
                            <span>标签管理</span>
                        </el-menu-item>
                        <el-menu-item index="/comments" :class="{'!bg-primary-700': $route.path.startsWith('/comments')}">
                            <el-icon><ChatDotRound /></el-icon>
                            <span>评论管理</span>
                        </el-menu-item>
                    </el-menu>
                </nav>
                <div class="p-4 border-t border-gray-700 text-sm text-gray-400 mt-auto">
                    <p>欢迎, {{ authStore.user?.username || '访客' }}</p>
                    <el-button type="danger" size="small" @click="logout" class="mt-2 w-full">登出</el-button>
                </div>
            </aside>

            <main class="flex-1 p-6 bg-gray-900 text-gray-50 overflow-auto" :class="{ 'md:pl-64': true, 'pl-0': !isLargeScreen && isSidebarOpen, 'pl-0 md:pl-64': !isLargeScreen && !isSidebarOpen }">
                <div class="max-w-7xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                    <router-view></router-view>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Moon, Sunny, Odometer, User, Document, Folder, PriceTag, ChatDotRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
};

const isSidebarOpen = ref(false); // Default to closed on mobile
const isLargeScreen = ref(window.innerWidth >= 768); // Track if screen is large enough to show sidebar by default

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Dark mode logic
const isDarkMode = ref(document.documentElement.classList.contains('dark'));

const darkModeIcon = computed(() => (isDarkMode.value ? Sunny : Moon));

const toggleDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  isDarkMode.value = !isDarkMode.value;
};

// Handle window resize
const handleResize = () => {
  isLargeScreen.value = window.innerWidth >= 768;
  // On larger screens, open sidebar by default
  if (isLargeScreen.value) {
    isSidebarOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Set initial state based on screen size
  isSidebarOpen.value = isLargeScreen.value;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Element Plus menu item custom styles */
.el-menu-item {
    border-radius: 0.375rem; /* rounded-md */
    margin-bottom: 0.5rem; /* space-y-2 */
    transition: background-color 0.2s, color 0.2s;
}

.el-menu-item.is-active {
    background-color: var(--el-menu-active-bg-color, #DC2626) !important; /* Use primary-600 */
    color: #ffffff !important; /* Ensure active state text is white */
}

.el-menu-item:hover {
    background-color: #374151 !important; /* hover:bg-gray-700 */
    color: #ffffff !important;
}

/* Override Element Plus default active text color to keep it white in dark mode */
.el-menu-vertical-demo .el-menu-item.is-active span {
    color: #ffffff !important;
}

/* Ensure el-button danger type remains red in dark mode */
:deep(.el-button--danger) {
    --el-button-bg-color: #DC2626; /* primary-600 */
    --el-button-hover-bg-color: #B91C1C; /* primary-700 */
    --el-button-active-bg-color: #991B1B; /* primary-800 */
    --el-button-border-color: #DC2626;
    --el-button-hover-border-color: #B91C1C;
    --el-button-active-border-color: #991B1B;
    --el-button-text-color: #ffffff;
}

/* Ensure el-button primary type remains red in dark mode */
:deep(.el-button--primary) {
    --el-button-bg-color: #DC2626; /* primary-600 */
    --el-button-hover-bg-color: #B91C1C; /* primary-700 */
    --el-button-active-bg-color: #991B1B; /* primary-800 */
    --el-button-border-color: #DC2626;
    --el-button-hover-border-color: #B91C1C;
    --el-button-active-border-color: #991B1B;
    --el-button-text-color: #ffffff;
}
</style>
