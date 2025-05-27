<template>
    <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-md">
        <template #header>
            <div class="card-header flex justify-between items-center">
                <h2 class="text-xl font-semibold text-primary-500">用户管理</h2>
                <el-button type="primary" @click="openUserDialog()">新增用户</el-button>
            </div>
        </template>

        <div v-loading="loading" element-loading-text="加载中..." class="min-h-64">
            <el-table :data="users" style="width: 100%" class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-md"
                    :header-cell-style="{ background: '#374151', color: '#E5E7EB', borderBottom: '1px solid #4B5563' }"
                    :row-style="{ background: '#1F2937' }"
                    :cell-style="{ borderBottom: '1px solid #4B5563' }"
            >
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
                        <el-button size="small" @click="openUserDialog(scope.row)">编辑</el-button>
                        <el-popconfirm
                            title="确定要删除此用户吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="deleteUser(scope.row.id)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

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
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端
import { Close } from '@element-plus/icons-vue'; // 导入关闭图标

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
/* 覆盖 Element Plus 表单组件在暗色模式下的样式 */
:deep(.el-form-item__label) {
    color: #E5E7EB !important; /* text-gray-50 */
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
    background-color: #374151 !important; /* bg-gray-700 */
    box-shadow: none !important;
    border: 1px solid #4B5563 !important; /* border-gray-600 */
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select__placeholder),
:deep(.el-select__suffix) {
    color: #E5E7EB !important; /* text-gray-50 */
}

:deep(.el-input__inner::placeholder),
:deep(.el-textarea__inner::placeholder) {
    color: #9CA3AF !important; /* text-gray-400 */
}

:deep(.el-switch__core) {
    background-color: #4B5563 !important; /* bg-gray-600 for off state */
    border-color: #4B5563 !important;
}
:deep(.el-switch.is-checked .el-switch__core) {
    background-color: #DC2626 !important; /* primary-600 for on state */
    border-color: #DC2626 !important;
}

/* 确保按钮样式正确 */
:deep(.el-button--primary) {
    --el-button-bg-color: #DC2626; /* primary-600 */
    --el-button-hover-bg-color: #B91C1C; /* primary-700 */
    --el-button-active-bg-color: #991B1B; /* primary-800 */
    --el-button-border-color: #DC2626;
    --el-button-hover-border-color: #B91C1C;
    --el-button-active-border-color: #991B1B;
    --el-button-text-color: #ffffff;
}

/* 表格样式 */
:deep(.el-table) {
  --el-table-bg-color: #1F2937; /* 表格背景 */
  --el-table-row-hover-bg-color: #374151; /* 行悬停背景 */
  --el-table-border-color: #4B5563; /* 边框颜色 */
  --el-table-text-color: #E5E7EB; /* 文本颜色 */
  --el-table-header-bg-color: #374151; /* 表头背景 */
  --el-table-header-text-color: #D1D5DB; /* 表头文本 */
}
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-header-bg-color) !important;
  color: var(--el-table-header-text-color) !important;
  border-bottom: var(--el-table-border-color) !important;
}
:deep(.el-table tr) {
  background-color: var(--el-table-bg-color) !important;
  color: var(--el-table-text-color) !important;
}
:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--el-table-border-color) !important;
}

/* 消息框的暗色模式样式 */
:deep(.el-message-box) {
  background-color: #1F2937 !important;
  border-color: #4B5563 !important;
  color: #E5E7EB !important;
}
:deep(.el-message-box__title) {
  color: #E5E7EB !important;
}
:deep(.el-message-box__message p) {
  color: #D1D5DB !important;
}
:deep(.el-message-box__input) {
  background-color: #374151 !important;
  border-color: #4B5563 !important;
}
:deep(.el-message-box__input .el-input__inner) {
  color: #E5E7EB !important;
}
</style>

