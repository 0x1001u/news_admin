import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/main.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersist)

const app = createApp(App)

// 添加全局错误处理
app.config.errorHandler = (err) => {
  console.error('Vue error:', err)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

console.log('正在挂载Vue应用...')
app.mount('#app')
console.log('Vue应用挂载完成')