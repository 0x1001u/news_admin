<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">新闻管理</h2>
        <el-button type="primary" @click="router.push('/news/new')">发布新闻</el-button>
        <el-table :data="news" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column label="作者">
                <template #default="scope">{{ scope.row.author ? scope.row.author.username : '未知' }}</template>
            </el-table-column>
            <el-table-column label="分类">
                <template #default="scope">{{ scope.row.category ? scope.row.category.name : '无' }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 'published' ? 'success' : (scope.row.status === 'draft' ? 'info' : 'warning')">
                        {{ scope.row.status === 'published' ? '已发布' : (scope.row.status === 'draft' ? '草稿' : '已归档') }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="view_count" label="浏览量" width="100"></el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/news/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteNews(scope.row.id)">删除</el-button>
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
const news = ref([]);

// Mock news data (replace with actual API calls)
const mockNews = [
    { id: 1, title: '新闻标题1', slug: 'news-title-1', summary: '这是新闻1的摘要', content: '新闻1的详细内容...', author_id: 1, category_id: 1, status: 'published', published_at: '2023-03-01T10:00:00Z', view_count: 120, created_at: '2023-03-01T09:00:00Z', updated_at: '2023-03-01T10:00:00Z', author: { id: 1, username: 'admin' }, category: { id: 1, name: '分类A' }, tags: [{ id: 1, name: '科技' }] },
    { id: 2, title: '新闻标题2', slug: 'news-title-2', summary: '这是新闻2的摘要', content: '新闻2的详细内容...', author_id: 2, category_id: 2, status: 'draft', published_at: null, view_count: 50, created_at: '2023-03-05T11:00:00Z', updated_at: '2023-03-05T11:00:00Z', author: { id: 2, username: 'user1' }, category: { id: 2, name: '体育' }, tags: [{ id: 2, name: '足球' }] },
];

const fetchNews = async () => {
    try {
        // In a real app: const response = await apiClient.get('/news');
        // news.value = response.data;
        news.value = mockNews; // Using mock data
    } catch (error) {
        console.error("Failed to fetch news:", error);
    }
};

const deleteNews = async (id) => {
    ElMessageBox.confirm('确定要删除此新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            // In a real app: await apiClient.delete(`/news/${id}`);
            const index = mockNews.findIndex(n => n.id === id);
            if (index !== -1) {
                mockNews.splice(index, 1); // Remove from mock data
            }
            ElMessage.success('新闻删除成功！');
            fetchNews(); // Refresh list
        } catch (error) {
            console.error("Failed to delete news:", error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchNews);
</script>

<style scoped>
/* Scoped styles for NewsListPage */
</style>

