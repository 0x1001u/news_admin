<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">标签管理</h2>
        <el-button type="primary" @click="router.push('/tags/new')">新增标签</el-button>
        <el-table :data="tags" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="slug" label="别名"></el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/tags/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteTag(scope.row.id)">删除</el-button>
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
const tags = ref([]);

// Mock tags data (replace with actual API calls)
const mockTags = [
    { id: 1, name: '科技', slug: 'tech', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: '足球', slug: 'football', created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' },
    { id: 3, name: '娱乐', slug: 'entertainment', created_at: '2023-01-03T00:00:00Z', updated_at: '2023-01-03T00:00:00Z' },
];

const fetchTags = async () => {
    try {
        // In a real app: const response = await apiClient.get('/tags');
        // tags.value = response.data;
        tags.value = mockTags; // Using mock data
    } catch (error) {
        console.error("Failed to fetch tags:", error);
    }
};

const deleteTag = async (id) => {
    ElMessageBox.confirm('确定要删除此标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            // In a real app: await apiClient.delete(`/tags/${id}`);
            const index = mockTags.findIndex(t => t.id === id);
            if (index !== -1) {
                mockTags.splice(index, 1); // Remove from mock data
            }
            ElMessage.success('标签删除成功！');
            fetchTags(); // Refresh list
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchTags);
</script>

<style scoped>
/* Scoped styles for TagListPage */
</style>

