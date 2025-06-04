<template>
  <div>
    <el-card>
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userFormRef = ref<FormInstance>()
const isEditMode = ref(false)
const userId = ref<number | null>(null)

// 表单数据
const userForm = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

// 表单验证规则
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!isEditMode.value && !value) {
    callback(new Error('请输入密码'))
  } else if (value && value.length < 6) {
    callback(new Error('密码长度至少为6位'))
  } else if (userForm.confirmPassword && value !== userForm.confirmPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== userForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 初始化表单（如果是编辑模式）
onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    userId.value = parseInt(route.params.id as string)
    try {
      const user = await userStore.getUserById(userId.value)
      Object.assign(userForm, {
        email: user.email,
        username: user.username,
        role: user.role,
        password: '',
        confirmPassword: ''
      })
    } catch (error) {
      ElMessage.error('获取用户信息失败')
      router.push('/users')
    }
  }
})

// 提交表单
const submitForm = async () => {
  try {
    await userFormRef.value?.validate()
    
    const userData: Partial<User> = {
      email: userForm.email,
      username: userForm.username,
      role: userForm.role
    }
    
    // 只有在密码不为空时才更新密码
    if (userForm.password) {
      userData.password = userForm.password
    }
    
    if (isEditMode.value && userId.value) {
      await userStore.updateUser(userId.value, userData)
      ElMessage.success('用户更新成功')
    } else {
      await userStore.createUser(userData as User)
      ElMessage.success('用户创建成功')
    }
    
    router.push('/users')
  } catch (error) {
    // 验证失败或API调用失败，不显示额外消息
  }
}

// 取消编辑
const cancel = () => {
  router.push('/users')
}
</script>