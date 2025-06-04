<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入分类名称" />
    </el-form-item>
    
    <el-form-item label="标识" prop="slug">
      <el-input v-model="form.slug" placeholder="请输入URL标识" />
    </el-form-item>
    
    <el-form-item label="描述" prop="description">
      <el-input 
        v-model="form.description" 
        type="textarea" 
        :rows="3" 
        placeholder="请输入分类描述" 
      />
    </el-form-item>
    
    <el-form-item label="父分类" prop="parentId">
      <el-select 
        v-model="form.parentId" 
        placeholder="请选择父分类"
        clearable
        filterable
      >
        <el-option 
          v-for="category in categories" 
          :key="category.id" 
          :label="category.name" 
          :value="category.id" 
        />
      </el-select>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  getCategory, 
  createCategory, 
  updateCategory,
  getCategories
} from '@/services/categories'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  parentId: number | null
}

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const categories = ref<Category[]>([])

const form = ref({
  id: null as number | null,
  name: '',
  slug: '',
  description: '',
  parentId: null as number | null
})

const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: '请输入URL标识', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符', trigger: 'blur' }
  ],
  description: [
    { max: 255, message: '描述不能超过255个字符', trigger: 'blur' }
  ]
})

onMounted(async () => {
  await fetchCategories()
  
  // 如果是编辑模式，加载分类数据
  if (route.name === 'CategoryEdit' && route.params.id) {
    const id = parseInt(route.params.id as string)
    await fetchCategory(id)
  }
  
  // 如果是创建子分类模式，设置父分类ID
  if (route.name === 'CategoryCreateChild' && route.params.parentId) {
    const parentId = parseInt(route.params.parentId as string)
    form.value.parentId = parentId
  }
})

async function fetchCategories() {
  try {
    const response = await getCategories()
    categories.value = response.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

async function fetchCategory(id: number) {
  try {
    const response = await getCategory(id)
    form.value = {
      id: response.data.id,
      name: response.data.name,
      slug: response.data.slug,
      description: response.data.description,
      parentId: response.data.parentId
    }
  } catch (error) {
    ElMessage.error('获取分类信息失败')
  }
}

async function submitForm() {
  if (!formRef.value) return
  
  const valid = await formRef.value.validate()
  if (!valid) return
  
  try {
    if (form.value.id) {
      // 更新分类
      await updateCategory(form.value.id, {
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId: form.value.parentId
      })
      ElMessage.success('分类更新成功')
    } else {
      // 创建分类
      await createCategory({
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId: form.value.parentId
      })
      ElMessage.success('分类创建成功')
    }
    router.push({ name: 'Categories' })
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

function cancel() {
  router.push({ name: 'Categories' })
}
</script>