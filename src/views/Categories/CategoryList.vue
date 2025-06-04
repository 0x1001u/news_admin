<template>
  <div>
    <el-button type="primary" @click="handleCreate">添加分类</el-button>
    <el-table
      :data="categories"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="slug" label="标识" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" @click="handleAddChild(scope.row)">添加子分类</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategories, deleteCategory } from '@/services/categories'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  children?: Category[]
}

const router = useRouter()
const categories = ref<Category[]>([])

onMounted(async () => {
  await fetchCategories()
})

async function fetchCategories() {
  try {
    const response = await getCategories()
    categories.value = response.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

function handleCreate() {
  router.push({ name: 'CategoryCreate' })
}

function handleEdit(row: Category) {
  router.push({ name: 'CategoryEdit', params: { id: row.id } })
}

function handleAddChild(row: Category) {
  router.push({ name: 'CategoryCreateChild', params: { parentId: row.id } })
}

async function handleDelete(row: Category) {
  try {
    await ElMessageBox.confirm('确定删除该分类吗？', '提示', {
      type: 'warning'
    })
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    await fetchCategories()
  } catch (error) {
    ElMessage.info('取消删除')
  }
}
</script>