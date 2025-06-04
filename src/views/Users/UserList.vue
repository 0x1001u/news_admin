<template>
  <div>
    <el-card>
      <div style="margin-bottom: 20px;">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名/邮箱"
          style="width: 300px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="Plus" @click="handleCreate" style="float: right;">
          添加用户
        </el-button>
      </div>

      <el-table :data="userList" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px; text-align: center;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchUsers"
          @current-change="fetchUsers"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUsersStore } from '@/stores/usersStore'
import type { User } from '@/types'

const usersStore = useUsersStore()
const router = useRouter()

const userList = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await usersStore.fetchUsers({
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value
    })
    userList.value = response.data
    total.value = response.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleCreate = () => {
  router.push('/users/create')
}

const handleEdit = (id: number) => {
  router.push(`/users/edit/${id}`)
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该用户吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await usersStore.deleteUser(id)
    ElMessage.success('用户删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败')
    }
  }
}
</script>