import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Element Plus 基本样式
import 'element-plus/es/components/theme-chalk/dark/css/var.css'; // Element Plus 暗色模式变量样式 - 修正导入路径
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 检查并设置初始的暗色模式 (可以根据用户偏好存储在 localStorage)
const isDarkMode = localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);

// Register Element Plus Icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.mount('#app');

