<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">分类管理</h2>
        <el-button type="primary" @click="router.push('/categories/new')">新增分类</el-button>
        <el-table :data="categories" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="slug" label="别名"></el-table-column>
            <el-table-column label="父分类">
                <template #default="scope">{{ scope.row.parent_id ? categories.find(c => c.id === scope.row.parent_id)?.name : '无' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/categories/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
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
const categories = ref([]);

// Mock categories data (replace with actual API calls)
const mockCategories = [
    { id: 1, name: '分类A', slug: 'category-a', description: '描述A', parent_id: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: '分类B', slug: 'category-b', description: '描述B', parent_id: null, created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' },
    { id: 3, name: '子分类A1', slug: 'sub-category-a1', description: '描述A1', parent_id: 1, created_at: '2023-01-03T00:00:00Z', updated_at: '2023-01-03T00:00:00Z' },
];

const fetchCategories = async () => {
    try {
        // In a real app: const response = await apiClient.get('/categories');
        // categories.value = response.data;
        categories.value = mockCategories; // Using mock data
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
};

const deleteCategory = async (id) => {
    ElMessageBox.confirm('确定要删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            // In a real app: await apiClient.delete(`/categories/${id}`);
            const index = mockCategories.findIndex(c => c.id === id);
            if (index !== -1) {
                mockCategories.splice(index, 1); // Remove from mock data
            }
            ElMessage.success('分类删除成功！');
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchCategories);
</script>

<style scoped>
/* Scoped styles for CategoryListPage */
</style>

