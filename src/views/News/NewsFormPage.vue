<template>
    <div class="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-gray-50">
        <h2 class="text-2xl font-bold text-primary-500 mb-4">{{ newsId ? '编辑新闻' : '发布新闻' }}</h2>
        <el-form :model="newsForm" label-width="80px" class="text-gray-50">
            <el-form-item label="标题">
                <el-input v-model="newsForm.title" class="!bg-gray-700 !text-gray-50"></el-input>
            </el-form-item>
            <el-form-item label="别名 (Slug)">
                <el-input v-model="newsForm.slug" class="!bg-gray-700 !text-gray-50"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
                <el-input type="textarea" v-model="newsForm.summary" rows="3" class="!bg-gray-700 !text-gray-50"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input type="textarea" v-model="newsForm.content" rows="10" class="!bg-gray-700 !text-gray-50"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="newsForm.category_id" placeholder="请选择分类" clearable class="!w-full !bg-gray-700 !text-gray-50">
                    <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="newsForm.status" class="!text-gray-50">
                    <el-radio label="draft" class="!text-gray-50">草稿</el-radio>
                    <el-radio label="published" class="!text-gray-50">已发布</el-radio>
                    <el-radio label="archived" class="!text-gray-50">已归档</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="router.push('/news')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端

const route = useRoute();
const router = useRouter();
const newsId = ref(route.params.newsId); // Get ID from route params

const newsForm = reactive({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category_id: null,
    status: 'draft',
    tag_ids: [] // Ensure tag_ids is initialized
});
const categories = ref([]);

const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/categories/');
        categories.value = response.data;
    } catch (error) {
        console.error("Failed to fetch categories for news form:", error);
        ElMessage.error('获取分类数据失败。');
    }
};

const fetchNewsDetail = async () => {
    if (newsId.value) {
        try {
            const response = await apiClient.get(`/news/${newsId.value}`);
            Object.assign(newsForm, response.data);
            // If tags are part of the response and you have a multi-select for tags
            // newsForm.tag_ids = response.data.tags ? response.data.tags.map(tag => tag.id) : [];
        } catch (error) {
            console.error("Failed to fetch news detail:", error);
            ElMessage.error('获取新闻详情失败。');
            router.push('/news');
        }
    }
};

const submitForm = async () => {
    try {
        if (newsId.value) {
            await apiClient.put(`/news/${newsId.value}`, newsForm);
            ElMessage.success('新闻更新成功！');
        } else {
            await apiClient.post('/news/', newsForm);
            ElMessage.success('新闻发布成功！');
        }
        router.push('/news');
    } catch (error) {
        console.error("Failed to save news:", error);
        ElMessage.error('保存新闻失败。');
    }
};

onMounted(() => {
    fetchCategories(); // 确保在组件挂载时获取分类
    fetchNewsDetail(); // 确保在组件挂载时获取新闻详情 (如果是编辑模式)
});

return { newsForm, categories, submitForm, router, newsId };
</script>

<style scoped>
/* Scoped styles for NewsFormPage */
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

:deep(.el-radio) {
    color: #E5E7EB !important; /* text-gray-50 */
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
    color: #DC2626 !important; /* primary-600 */
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
    background-color: #DC2626 !important;
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
</style>

