<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ id ? '编辑分类' : '新增分类' }}</h2>
        <el-form :model="categoryForm" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="categoryForm.name"></el-input>
            </el-form-item>
            <el-form-item label="别名">
                <el-input v-model="categoryForm.slug"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="categoryForm.description"></el-input>
            </el-form-item>
            <el-form-item label="父分类">
                <el-select v-model="categoryForm.parent_id" placeholder="选择父分类" clearable>
                    <el-option v-for="cat in availableParentCategories" :key="cat.id" :label="cat.name" :value="cat.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="router.push('/categories')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import apiClient from '../../services/api'; // For actual API calls

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id); // Get ID from route params

const categoryForm = reactive({
    name: '',
    slug: '',
    description: '',
    parent_id: null
});
const allCategories = ref([]); // Store all categories to filter for parent selection

// Mock categories data
const mockCategories = [
    { id: 1, name: '分类A', slug: 'category-a', description: '描述A', parent_id: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: '分类B', slug: 'category-b', description: '描述B', parent_id: null, created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' },
    { id: 3, name: '子分类A1', slug: 'sub-category-a1', description: '描述A1', parent_id: 1, created_at: '2023-01-03T00:00:00Z', updated_at: '2023-01-03T00:00:00Z' },
];

const fetchCategories = async () => {
    try {
        // In a real app: const response = await apiClient.get('/categories');
        // allCategories.value = response.data;
        allCategories.value = mockCategories; // Using mock data
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
};

const fetchCategoryDetail = async () => {
    if (id.value) {
        try {
            // In a real app: const response = await apiClient.get(`/categories/${id.value}`);
            // Object.assign(categoryForm, response.data);
            const category = mockCategories.find(c => c.id === parseInt(id.value));
            if (category) {
                Object.assign(categoryForm, category);
            } else {
                ElMessage.error('分类未找到！');
                router.push('/categories');
            }
        } catch (error) {
            console.error("Failed to fetch category detail:", error);
            ElMessage.error('获取分类详情失败。');
        }
    }
};

// Filter out the current category and its children from parent options to prevent circular dependency
const availableParentCategories = computed(() => {
    if (!id.value) {
        return allCategories.value; // For new category, all existing categories are potential parents
    }
    const currentCategoryId = parseInt(id.value);
    const childrenIds = new Set();

    // Recursive function to find all children of a category
    const findChildren = (categoryId) => {
        allCategories.value.forEach(cat => {
            if (cat.parent_id === categoryId) {
                childrenIds.add(cat.id);
                findChildren(cat.id);
            }
        });
    };

    findChildren(currentCategoryId);

    return allCategories.value.filter(cat =>
        cat.id !== currentCategoryId && !childrenIds.has(cat.id)
    );
});

const submitForm = async () => {
    try {
        if (id.value) {
            // In a real app: await apiClient.put(`/categories/${id.value}`, categoryForm);
            const index = mockCategories.findIndex(c => c.id === parseInt(id.value));
            if (index !== -1) {
                Object.assign(mockCategories[index], categoryForm);
                mockCategories[index].updated_at = new Date().toISOString();
            }
            ElMessage.success('分类更新成功！');
        } else {
            // In a real app: await apiClient.post('/categories/', categoryForm);
            const newCategory = {
                id: mockCategories.length ? Math.max(...mockCategories.map(c => c.id)) + 1 : 1,
                ...categoryForm,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            mockCategories.push(newCategory);
            ElMessage.success('分类创建成功！');
        }
        router.push('/categories');
    } catch (error) {
        console.error("Failed to save category:", error);
        ElMessage.error('保存分类失败。');
    }
};

onMounted(() => {
    fetchCategories();
    fetchCategoryDetail();
});
</script>

<style scoped>
/* Scoped styles for CategoryFormPage */
</style>

