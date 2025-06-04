<template>
  <div class="profile-container">
    <el-form :model="form" :rules="rules" ref="profileForm" @submit.prevent="handleUpdate">
      <h2>个人信息</h2>
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="form.avatar" placeholder="请输入头像URL" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">更新信息</el-button>
      </el-form-item>
      <div v-if="error" class="error-message">{{ error }}</div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'

const authStore = useAuthStore()
const profileForm = ref(null)
const loading = ref(false)
const error = ref('')

const form = ref({
  username: '',
  email: '',
  nickname: '',
  avatar: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
}

onMounted(() => {
  // 从store加载用户信息
  if (authStore.user) {
    form.value = {
      username: authStore.user.username,
      email: authStore.user.email,
      nickname: authStore.user.nickname || '',
      avatar: authStore.user.avatar || ''
    }
  }
})

const handleUpdate = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const updatedUser = await authService.updateMe({
      email: form.value.email,
      nickname: form.value.nickname,
      avatar: form.value.avatar
    })
    
    // 更新store中的用户信息
    authStore.setUser(updatedUser)
    ElMessage.success('信息更新成功')
  } catch (err) {
    error.value = err.response?.data?.message || '更新失败，请重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.error-message {
  color: #f56c6c;
  margin-top: 10px;
}
</style>