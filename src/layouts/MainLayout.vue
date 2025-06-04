<template>
  <div v-if="isAuthenticated" class="main-layout">
    <!-- 侧边导航菜单 -->
    <aside class="sidebar">
      <nav>
        <router-link to="/dashboard">仪表盘</router-link>
        <router-link to="/users">用户管理</router-link>
        <router-link to="/news">新闻管理</router-link>
        <router-link to="/categories">分类管理</router-link>
        <router-link to="/tags">标签管理</router-link>
        <router-link to="/comments">评论管理</router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部状态栏 -->
      <header class="top-bar">
        <div class="user-info">
          <span>管理员</span>
          <button @click="logout">退出</button>
        </div>
      </header>

      <!-- 内容区域 -->
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore()

    const logout = () => {
      // 退出登录逻辑
      authStore.logout()
      router.push('/login');
    };

    const isAuthenticated = computed(() => {
      return !!authStore.token
    })

    return {
      logout,
      isAuthenticated
    };
  }
});
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
}

.sidebar nav a {
  color: white;
  padding: 10px 0;
  text-decoration: none;
}

.sidebar nav a.router-link-active {
  font-weight: bold;
}

.top-bar {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  text-align: right;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>