<template>
  <div class="debug-container">
    <h2>认证诊断面板</h2>
    
    <div class="section">
      <h3>Token状态</h3>
      <p>当前Token: {{ authStore.token ? '*****' + authStore.token.slice(-8) : '未获取' }}</p>
      <p>Token类型: {{ authStore.tokenType || '未设置' }}</p>
      <button @click="checkToken">验证Token有效性</button>
      <div v-if="tokenCheckResult" class="result">
        {{ tokenCheckResult }}
      </div>
    </div>
    
    <div class="section">
      <h3>模拟登录</h3>
      <input v-model="debugUsername" placeholder="用户名" />
      <input v-model="debugPassword" type="password" placeholder="密码" />
      <button @click="testLogin">测试登录</button>
      <div v-if="loginResult" class="result">
        {{ loginResult }}
      </div>
    </div>
    
    <div class="section">
      <h3>最近请求日志</h3>
      <div v-for="(log, index) in requestLogs" :key="index" class="log-entry">
        [{{ log.timestamp }}] {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const authStore = useAuthStore();
const debugUsername = ref('test@example.com');
const debugPassword = ref('test123');
const tokenCheckResult = ref('');
const loginResult = ref('');
const requestLogs = ref<Array<{timestamp: string; message: string}>>([]);

// 监听所有API请求
api.interceptors.request.use(config => {
  const log = `请求: ${config.method?.toUpperCase()} ${config.url}`;
  requestLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message: log
  });
  return config;
});

api.interceptors.response.use(response => {
  const log = `响应: ${response.status} ${response.config.url}`;
  requestLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message: log
  });
  return response;
}, error => {
  const log = `错误: ${error.response?.status || '无响应'} ${error.config?.url} - ${error.message}`;
  requestLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message: log
  });
  return Promise.reject(error);
});

const checkToken = async () => {
  tokenCheckResult.value = '验证中...';
  try {
    await authStore.fetchCurrentUser();
    if (authStore.userData) {
      tokenCheckResult.value = `Token有效! 用户: ${authStore.userData.email}`;
    } else {
      tokenCheckResult.value = 'Token有效，但未获取到用户信息';
    }
  } catch (error: any) {
    tokenCheckResult.value = `验证失败: ${error.message}`;
  }
};

const testLogin = async () => {
  loginResult.value = '登录中...';
  try {
    await authStore.login({
      email: debugUsername.value,
      password: debugPassword.value
    });
    loginResult.value = '登录成功!';
  } catch (error: any) {
    loginResult.value = `登录失败: ${error.message}`;
  }
};

onMounted(() => {
  requestLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message: '诊断面板已初始化'
  });
});
</script>

<style scoped>
.debug-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}
button {
  margin: 10px 5px;
  padding: 8px 15px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
input {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 300px;
}
.result {
  margin-top: 10px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}
.log-entry {
  font-family: monospace;
  font-size: 0.9em;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
</style>