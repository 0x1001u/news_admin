<template>
  <div class="register-container">
    <el-form :model="form" :rules="rules" ref="registerForm" @submit.prevent="handleRegister">
      <h2>注册</h2>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">注册</el-button>
      </el-form-item>
      <div v-if="error" class="error-message">{{ error }}</div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { authService } from '@/services/auth'

const registerForm = ref(null)
const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authService.registerUser(form.value)
    ElMessage.success('注册成功')
    // 这里可以添加自动登录或跳转到登录页逻辑
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
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