<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">用户管理</h2>
        <el-button type="primary" @click="router.push('/users/new')">新增用户</el-button>
        <el-table :data="users" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column label="角色">
                <template #default="scope">
                    <el-tag :type="scope.row.is_superuser ? 'success' : 'info'">
                        {{ scope.row.is_superuser ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.is_active ? 'success' : 'danger'">
                        {{ scope.row.is_active ? '活跃' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/users/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api'; // For actual API calls

const router = useRouter();
const users = ref([]);

// Mock users data (replace with actual API calls)
const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@example.com', full_name: '管理员', is_active: true, is_superuser: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, username: 'user1', email: 'user1@example.com', full_name: '普通用户1', is_active: true, is_superuser: false, created_at: '2023-02-01T00:00:00Z', updated_at: '2023-02-01T00:00:00Z' },
    { id: 3, username: 'user2', email: 'user2@example.com', full_name: '普通用户2', is_active: false, is_superuser: false, created_at: '2023-03-01T00:00:00Z', updated_at: '2023-03-01T00:00:00Z' },
];

const fetchUsers = async () => {
    try {
        // In a real app: const response = await apiClient.get('/users');
        // users.value = response.data;
        users.value = mockUsers; // Using mock data
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};

const deleteUser = async (id) => {
    ElMessageBox.confirm('确定要删除此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            // In a real app: await apiClient.delete(`/users/${id}`);
            const index = mockUsers.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUsers.splice(index, 1); // Remove from mock data
            }
            ElMessage.success('用户删除成功！');
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchUsers);
</script>

<style scoped>
/* Scoped styles for UserListPage */
</style>

