import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from './plugins/piniaPersist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/main.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

// 添加全局错误处理
app.config.errorHandler = (err) => {
  console.error('Vue error:', err)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 注册虚拟滚动组件
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
app.use(VueVirtualScroller)

console.log('正在挂载Vue应用...')
app.mount('#app')
console.log('Vue应用挂载完成')