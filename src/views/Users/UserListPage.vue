<template>
    <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-md">
        <template #header>
            <div class="card-header flex justify-between items-center">
                <h2 class="text-xl font-semibold text-primary-500">用户管理</h2>
                <el-button type="primary" @click="openUserDialog()">新增用户</el-button>
            </div>
        </template>

        <div v-loading="loading" element-loading-text="加载中..." class="min-h-64">
            <GenericDataTable
                :columns="columns"
                :data="users"
                :loading="loading"
                :showPagination="false"
            >
                <!-- 角色列自定义渲染 -->
                <template #column-is_superuser="{ row }">
                    <el-tag :type="row.is_superuser ? 'success' : 'info'">
                        {{ row.is_superuser ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
                
                <!-- 状态列自定义渲染 -->
                <template #column-is_active="{ row }">
                    <el-tag :type="row.is_active ? 'success' : 'danger'">
                        {{ row.is_active ? '活跃' : '禁用' }}
                    </el-tag>
                </template>
                
                <!-- 操作列 -->
                <template #default="{ row }">
                    <el-button size="small" @click="openUserDialog(row)">编辑</el-button>
                    <el-popconfirm
                        title="确定要删除此用户吗？"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        @confirm="deleteUser(row.id)"
                    >
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </GenericDataTable>

            <el-empty v-if="!users.length && !loading" description="暂无用户数据" class="text-gray-400" />
        </div>

        <el-dialog v-model="userDialogVisible" :title="currentUserId ? '编辑用户' : '新增用户'" width="500px"
                   class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-lg shadow-xl">
            <template #header="{ close, titleId, title }">
                <div class="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                    <span :id="titleId" class="text-lg font-semibold text-primary-500">{{ title }}</span>
                    <el-button link type="info" @click="close">
                        <el-icon><Close /></el-icon>
                    </el-button>
                </div>
            </template>
            <el-form :model="userForm" label-width="80px" class="p-4">
                <el-form-item label="用户名">
                    <el-input v-model="userForm.username" class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="userForm.email" class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="!currentUserId">
                    <el-input type="password" v-model="userForm.password" show-password class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="管理员">
                    <el-switch v-model="userForm.is_superuser"></el-switch>
                </el-form-item>
                <el-form-item label="活跃">
                    <el-switch v-model="userForm.is_active"></el-switch>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer px-4 py-2 border-t border-gray-700 flex justify-end space-x-2">
                    <el-button @click="userDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitUserForm">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api';
import { Close } from '@element-plus/icons-vue';
import GenericDataTable from '../../components/GenericDataTable.vue'; // 导入通用表格组件

const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'username', label: '用户名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'is_superuser', label: '角色' },
  { prop: 'is_active', label: '状态' }
];

const users = ref([]);
const userDialogVisible = ref(false);
const userForm = reactive({
    username: '',
    email: '',
    password: '',
    is_superuser: false,
    is_active: true
});
const currentUserId = ref(null);
const loading = ref(false);

const fetchUsers = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get('/users/');
        users.value = response.data;
    } catch (error) {
        ElMessage.error('获取用户列表失败！');
        console.error('Failed to fetch users:', error);
    } finally {
        loading.value = false;
    }
};

const openUserDialog = (user = null) => {
    if (user) {
        currentUserId.value = user.id;
        Object.assign(userForm, user);
        userForm.password = ''; // Don't pre-fill password for security
    } else {
        currentUserId.value = null;
        Object.assign(userForm, { username: '', email: '', password: '', is_superuser: false, is_active: true });
    }
    userDialogVisible.value = true;
};

const submitUserForm = async () => {
    try {
        if (currentUserId.value) {
            // Only send password if it's explicitly set for update
            const dataToSend = { ...userForm };
            if (!dataToSend.password) {
                delete dataToSend.password;
            }
            await apiClient.put(`/users/${currentUserId.value}`, dataToSend);
            ElMessage.success('用户更新成功！');
        } else {
            await apiClient.post('/auth/register', userForm); // Assuming register endpoint for new users
            ElMessage.success('用户创建成功！');
        }
        userDialogVisible.value = false;
        fetchUsers();
    } catch (error) {
        ElMessage.error('保存用户失败。');
        console.error('Failed to save user:', error);
    }
};

const deleteUser = async (id) => {
    ElMessageBox.confirm('确定要删除此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dark-message-box' // 为暗色模式添加自定义类
    }).then(async () => {
        try {
            await apiClient.delete(`/users/${id}`);
            ElMessage.success('用户删除成功！');
            fetchUsers();
        } catch (error) {
            ElMessage.error('删除用户失败！');
            console.error('Failed to delete user:', error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchUsers);
</script>

<style scoped>
/* 保留对话框相关样式 */
</style>

