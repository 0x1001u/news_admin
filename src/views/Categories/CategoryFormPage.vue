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
import { useRoute, useRouter } from 'vue-router'; // 修正了这里的语法错误
import { ElMessage } from 'element-plus';
import { categoryService } from '../../services/categories'; // 导入实际的分类服务

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

const fetchCategories = async () => {
    try {
        const data = await categoryService.getCategories(); // 调用实际的 API 服务
        allCategories.value = data;
    } catch (error) {
        console.error("Failed to fetch categories for parent selection:", error);
        ElMessage.error('获取父分类数据失败。');
    }
};

const fetchCategoryDetail = async () => {
    if (id.value) {
        try {
            const data = await categoryService.getCategory(parseInt(id.value)); // 调用实际的 API 服务
            Object.assign(categoryForm, data);
        } catch (error) {
            console.error("Failed to fetch category detail:", error);
            ElMessage.error('获取分类详情失败。');
            router.push('/categories'); // 获取失败则返回列表页
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
            await categoryService.updateCategory(parseInt(id.value), categoryForm); // 调用实际的 API 服务
            ElMessage.success('分类更新成功！');
        } else {
            await categoryService.createCategory(categoryForm); // 调用实际的 API 服务
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

