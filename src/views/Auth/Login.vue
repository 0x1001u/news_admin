<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" ref="loginForm" @submit.prevent="handleLogin">
      <h2>登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密 码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
      </el-form-item>
      <div v-if="error" class="error-message">{{ error }}</div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const loginForm = ref(null)
const loading = ref(false)
const error = ref('')

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      username: form.value.username,
      password: form.value.password
    })
    ElMessage.success('登录成功')
    
    // 状态更新后立即跳转
    const redirect = route.query.redirect as string || { name: 'Dashboard' }
    router.push(redirect)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '登录失败，请重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.error-message {
  color: #f56c6c;
  margin-top: 10px;
}
</style>