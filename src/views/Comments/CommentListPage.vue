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
import { commentService } from '../../services/comments'; // 导入实际的评论服务

const comments = ref([]);

const fetchComments = async () => {
    try {
        const data = await commentService.getComments(); // 调用实际的 API 服务
        comments.value = data;
    } catch (error) {
        console.error("获取评论列表失败:", error);
        ElMessage.error('获取评论数据失败。');
    }
};

const deleteComment = async (id) => {
    ElMessageBox.confirm('确定要删除此评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await commentService.deleteComment(id); // 调用实际的 API 服务
            ElMessage.success('评论删除成功！');
            fetchComments(); // 刷新列表
        } catch (error) {
            console.error("删除评论失败:", error);
            ElMessage.error('删除评论失败。');
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

