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
import { userService } from '../../services/users'; // 导入实际的用户服务

const router = useRouter();
const users = ref([]);

const fetchUsers = async () => {
    try {
        const data = await userService.getUsers(); // 调用实际的 API 服务
        users.value = data;
    } catch (error) {
        console.error("获取用户列表失败:", error);
    }
};

const deleteUser = async (id) => {
    ElMessageBox.confirm('确定要删除此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await userService.deleteUser(id); // 调用实际的 API 服务
            ElMessage.success('用户删除成功！');
            fetchUsers(); // 刷新列表
        } catch (error) {
            console.error("删除用户失败:", error);
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

