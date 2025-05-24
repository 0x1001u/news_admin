<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ id ? '编辑新闻' : '发布新闻' }}</h2>
        <el-form :model="newsForm" label-width="80px">
            <el-form-item label="标题">
                <el-input v-model="newsForm.title"></el-input>
            </el-form-item>
            <el-form-item label="别名 (Slug)">
                <el-input v-model="newsForm.slug"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
                <el-input type="textarea" v-model="newsForm.summary"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input type="textarea" v-model="newsForm.content" rows="10"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="newsForm.category_id" placeholder="请选择分类" clearable>
                    <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="newsForm.status">
                    <el-radio label="draft">草稿</el-radio>
                    <el-radio label="published">已发布</el-radio>
                    <el-radio label="archived">已归档</el-radio>
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
// import apiClient from '../../services/api'; // 不再直接使用 apiClient，而是通过 service 封装
import { newsService } from '../../services/news'; // 导入新闻服务
import { categoryService } from '../../services/categories'; // 导入分类服务

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id); // Get ID from route params

const newsForm = reactive({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category_id: null,
    status: 'draft'
});
const categories = ref([]);

// 移除 mockNews 和 mockCategories，因为我们将从后端获取数据
// const mockNews = [...];
// const mockCategories = [...];

const fetchCategories = async () => {
    try {
        const data = await categoryService.getCategories(); // 调用实际的 API 服务获取分类
        categories.value = data;
    } catch (error) {
        console.error("Failed to fetch categories for news form:", error);
        ElMessage.error('获取分类数据失败。');
    }
};

const fetchNewsDetail = async () => {
    if (id.value) {
        try {
            const data = await newsService.getNewsDetail(id.value); // 调用实际的 API 服务获取新闻详情
            Object.assign(newsForm, data);
        } catch (error) {
            console.error("Failed to fetch news detail:", error);
            ElMessage.error('获取新闻详情失败。');
            router.push('/news');
        }
    }
};

const submitForm = async () => {
    try {
        if (id.value) {
            await newsService.updateNews(id.value, newsForm); // 调用实际的 API 服务更新新闻
            ElMessage.success('新闻更新成功！');
        } else {
            await newsService.createNews(newsForm); // 调用实际的 API 服务创建新闻
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
</script>

<style scoped>
/* Scoped styles for NewsFormPage */
</style>

