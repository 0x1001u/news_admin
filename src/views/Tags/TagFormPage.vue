<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ id ? '编辑标签' : '新增标签' }}</h2>
        <el-form :model="tagForm" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="tagForm.name"></el-input>
            </el-form-item>
            <el-form-item label="别名">
                <el-input v-model="tagForm.slug"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="router.push('/tags')">取消</el-button>
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

const tagForm = reactive({
    name: '',
    slug: ''
});

// Mock tags data
const mockTags = [
    { id: 1, name: '科技', slug: 'tech', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: '足球', slug: 'football', created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' },
    { id: 3, name: '娱乐', slug: 'entertainment', created_at: '2023-01-03T00:00:00Z', updated_at: '2023-01-03T00:00:00Z' },
];

const fetchTagDetail = async () => {
    if (id.value) {
        try {
            // In a real app: const response = await apiClient.get(`/tags/${id.value}`);
            // Object.assign(tagForm, response.data);
            const tag = mockTags.find(t => t.id === parseInt(id.value));
            if (tag) {
                Object.assign(tagForm, tag);
            } else {
                ElMessage.error('标签未找到！');
                router.push('/tags');
            }
        } catch (error) {
            console.error("Failed to fetch tag detail:", error);
            ElMessage.error('获取标签详情失败。');
        }
    }
};

const submitForm = async () => {
    try {
        if (id.value) {
            // In a real app: await apiClient.put(`/tags/${id.value}`, tagForm);
            const index = mockTags.findIndex(t => t.id === parseInt(id.value));
            if (index !== -1) {
                Object.assign(mockTags[index], tagForm);
                mockTags[index].updated_at = new Date().toISOString();
            }
            ElMessage.success('标签更新成功！');
        } else {
            // In a real app: await apiClient.post('/tags/', tagForm);
            const newTag = {
                id: mockTags.length ? Math.max(...mockTags.map(t => t.id)) + 1 : 1,
                ...tagForm,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            mockTags.push(newTag);
            ElMessage.success('标签创建成功！');
        }
        router.push('/tags');
    } catch (error) {
        console.error("Failed to save tag:", error);
        ElMessage.error('保存标签失败。');
    }
};

onMounted(fetchTagDetail);
</script>

<style scoped>
/* Scoped styles for TagFormPage */
</style>

