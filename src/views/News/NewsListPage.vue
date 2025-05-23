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
import { newsService } from '../../services/news'; // 导入实际的新闻服务

const router = useRouter();
const news = ref([]);

const fetchNews = async () => {
    try {
        const data = await newsService.getNews(); // 调用实际的 API 服务
        news.value = data;
    } catch (error) {
        console.error("获取新闻列表失败:", error);
    }
};

const deleteNews = async (id) => {
    ElMessageBox.confirm('确定要删除此新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await newsService.deleteNews(id); // 调用实际的 API 服务
            ElMessage.success('新闻删除成功！');
            fetchNews(); // 刷新列表
        } catch (error) {
            console.error("删除新闻失败:", error);
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

