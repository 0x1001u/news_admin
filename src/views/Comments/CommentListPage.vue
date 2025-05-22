<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">评论管理</h2>
        <el-table :data="comments" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column label="新闻ID" width="100">
                <template #default="scope">{{ scope.row.news_id }}</template>
            </el-table-column>
            <el-table-column label="评论用户">
                <template #default="scope">{{ scope.row.user ? scope.row.user.username : '未知' }}</template>
            </el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column label="父评论ID" width="120">
                <template #default="scope">{{ scope.row.parent_comment_id || '无' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="deleteComment(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api'; // For actual API calls

const comments = ref([]);

// Mock comments data (replace with actual API calls)
const mockComments = [
    { id: 1, news_id: 1, user_id: 2, content: '评论1内容', parent_comment_id: null, created_at: '2023-03-02T12:00:00Z', updated_at: '2023-03-02T12:00:00Z', user: { id: 2, username: 'user1' }, replies: [] },
    { id: 2, news_id: 1, user_id: 1, content: '回复评论1', parent_comment_id: 1, created_at: '2023-03-02T13:00:00Z', updated_at: '2023-03-02T13:00:00Z', user: { id: 1, username: 'admin' }, replies: [] },
    { id: 3, news_id: 2, user_id: 2, content: '评论2内容', parent_comment_id: null, created_at: '2023-03-03T14:00:00Z', updated_at: '2023-03-03T14:00:00Z', user: { id: 2, username: 'user1' }, replies: [] },
];

const fetchComments = async () => {
    try {
        // In a real app: const response = await apiClient.get('/comments');
        // comments.value = response.data;
        comments.value = mockComments; // Using mock data
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    }
};

const deleteComment = async (id) => {
    ElMessageBox.confirm('确定要删除此评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            // In a real app: await apiClient.delete(`/comments/${id}`);
            const index = mockComments.findIndex(c => c.id === id);
            if (index !== -1) {
                mockComments.splice(index, 1); // Remove from mock data
            }
            ElMessage.success('评论删除成功！');
            fetchComments(); // Refresh list
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchComments);
</script>

<style scoped>
/* Scoped styles for CommentListPage */
</style>

