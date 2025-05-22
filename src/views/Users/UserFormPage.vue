<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ id ? '编辑用户' : '新增用户' }}</h2>
        <el-form :model="userForm" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="userForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" v-if="!id">
                <el-input type="password" v-model="userForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-switch v-model="userForm.is_superuser"></el-switch>
            </el-form-item>
            <el-form-item label="活跃">
                <el-switch v-model="userForm.is_active"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="router.push('/users')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import apiClient from '../../services/api'; // For actual API calls

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id); // Get ID from route params

const userForm = reactive({
    username: '',
    email: '',
    password: '', // Only for new user creation
    is_superuser: false,
    is_active: true
});

// Mock users data (should be managed by a store or fetched from API)
const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@example.com', full_name: '管理员', is_active: true, is_superuser: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, username: 'user1', email: 'user1@example.com', full_name: '普通用户1', is_active: true, is_superuser: false, created_at: '2023-02-01T00:00:00Z', updated_at: '2023-02-01T00:00:00Z' },
    { id: 3, username: 'user2', email: 'user2@example.com', full_name: '普通用户2', is_active: false, is_superuser: false, created_at: '2023-03-01T00:00:00Z', updated_at: '2023-03-01T00:00:00Z' },
];

const fetchUser = async () => {
    if (id.value) {
        try {
            // In a real app: const response = await apiClient.get(`/users/${id.value}`);
            // Object.assign(userForm, response.data);
            const user = mockUsers.find(u => u.id === parseInt(id.value));
            if (user) {
                Object.assign(userForm, user);
                userForm.password = ''; // Clear password field for security
            } else {
                ElMessage.error('用户未找到！');
                router.push('/users');
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            ElMessage.error('获取用户数据失败。');
        }
    }
};

const submitForm = async () => {
    try {
        if (id.value) {
            // In a real app: await apiClient.put(`/users/${id.value}`, userForm);
            const index = mockUsers.findIndex(u => u.id === parseInt(id.value));
            if (index !== -1) {
                Object.assign(mockUsers[index], userForm);
                mockUsers[index].updated_at = new Date().toISOString();
            }
            ElMessage.success('用户更新成功！');
        } else {
            // In a real app: await apiClient.post('/users/', userForm);
            const newUser = {
                id: mockUsers.length ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1,
                ...userForm,
                hashed_password: 'mock_hashed_password', // Mock hashed password
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            mockUsers.push(newUser);
            ElMessage.success('用户创建成功！');
        }
        router.push('/users');
    } catch (error) {
        console.error("Failed to save user:", error);
        ElMessage.error('保存用户失败。');
    }
};

onMounted(fetchUser);
</script>

<style scoped>
/* Scoped styles for UserFormPage */
</style>

