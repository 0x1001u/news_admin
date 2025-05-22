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
import apiClient from '../../services/api'; // For actual API calls

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

// Mock news data (should be managed by a store or fetched from API)
const mockNews = [
    { id: 1, title: '新闻标题1', slug: 'news-title-1', summary: '这是新闻1的摘要', content: '新闻1的详细内容...', author_id: 1, category_id: 1, status: 'published', published_at: '2023-03-01T10:00:00Z', view_count: 120, created_at: '2023-03-01T09:00:00Z', updated_at: '2023-03-01T10:00:00Z', author: { id: 1, username: 'admin' }, category: { id: 1, name: '分类A' }, tags: [{ id: 1, name: '科技' }] },
    { id: 2, title: '新闻标题2', slug: 'news-title-2', summary: '这是新闻2的摘要', content: '新闻2的详细内容...', author_id: 2, category_id: 2, status: 'draft', published_at: null, view_count: 50, created_at: '2023-03-05T11:00:00Z', updated_at: '2023-03-05T11:00:00Z', author: { id: 2, username: 'user1' }, category: { id: 2, name: '体育' }, tags: [{ id: 2, name: '足球' }] },
];

// Mock categories data
const mockCategories = [
    { id: 1, name: '分类A', slug: 'category-a', description: '描述A', parent_id: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: '分类B', slug: 'category-b', description: '描述B', parent_id: null, created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' },
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

const fetchNewsDetail = async () => {
    if (id.value) {
        try {
            // In a real app: const response = await apiClient.get(`/news/${id.value}`);
            // Object.assign(newsForm, response.data);
            const newsItem = mockNews.find(n => n.id === parseInt(id.value));
            if (newsItem) {
                Object.assign(newsForm, newsItem);
            } else {
                ElMessage.error('新闻未找到！');
                router.push('/news');
            }
        } catch (error) {
            console.error("Failed to fetch news detail:", error);
            ElMessage.error('获取新闻详情失败。');
        }
    }
};

const submitForm = async () => {
    try {
        if (id.value) {
            // In a real app: await apiClient.put(`/news/${id.value}`, newsForm);
            const index = mockNews.findIndex(n => n.id === parseInt(id.value));
            if (index !== -1) {
                Object.assign(mockNews[index], newsForm);
                mockNews[index].updated_at = new Date().toISOString();
            }
            ElMessage.success('新闻更新成功！');
        } else {
            // In a real app: await apiClient.post('/news/', newsForm);
            const newNewsItem = {
                id: mockNews.length ? Math.max(...mockNews.map(n => n.id)) + 1 : 1,
                ...newsForm,
                author_id: 1, // Mock author ID
                view_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            mockNews.push(newNewsItem);
            ElMessage.success('新闻发布成功！');
        }
        router.push('/news');
    } catch (error) {
        console.error("Failed to save news:", error);
        ElMessage.error('保存新闻失败。');
    }
};

onMounted(() => {
    fetchCategories();
    fetchNewsDetail();
});
</script>

<style scoped>
/* Scoped styles for NewsFormPage */
</style>

