<template>
    <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-md">
        <template #header>
            <div class="card-header flex justify-between items-center">
                <h2 class="text-xl font-semibold text-primary-500">评论管理</h2>
                </div>
        </template>

        <div v-loading="loading" element-loading-text="加载中..." class="min-h-64">
            <el-table :data="comments" style="width: 100%" class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-md"
                    :header-cell-style="{ background: '#374151', color: '#E5E7EB', borderBottom: '1px solid #4B5563' }"
                    :row-style="{ background: '#1F2937' }"
                    :cell-style="{ borderBottom: '1px solid #4B5563' }"
            >
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
                        <el-popconfirm
                            title="确定要删除此评论吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="deleteComment(scope.row.id)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-empty v-if="!comments.length && !loading" description="暂无评论数据" class="text-gray-400" />
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端

const comments = ref([]);
const loading = ref(false);

const fetchComments = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get('/comments/');
        comments.value = response.data;
    } catch (error) {
        ElMessage.error('获取评论列表失败！');
        console.error('Failed to fetch comments:', error);
    } finally {
        loading.value = false;
    }
};

const deleteComment = async (id) => {
    ElMessageBox.confirm('确定要删除此评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dark-message-box' // 为暗色模式添加自定义类
    }).then(async () => {
        try {
            await apiClient.delete(`/comments/${id}`);
            ElMessage.success('评论删除成功！');
            fetchComments();
        } catch (error) {
            ElMessage.error('删除评论失败！');
            console.error('Failed to delete comment:', error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchComments);
</script>

<style scoped>
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

/* 表格样式 */
:deep(.el-table) {
  --el-table-bg-color: #1F2937; /* 表格背景 */
  --el-table-row-hover-bg-color: #374151; /* 行悬停背景 */
  --el-table-border-color: #4B5563; /* 边框颜色 */
  --el-table-text-color: #E5E7EB; /* 文本颜色 */
  --el-table-header-bg-color: #374151; /* 表头背景 */
  --el-table-header-text-color: #D1D5DB; /* 表头文本 */
}
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-header-bg-color) !important;
  color: var(--el-table-header-text-color) !important;
  border-bottom: var(--el-table-border-color) !important;
}
:deep(.el-table tr) {
  background-color: var(--el-table-bg-color) !important;
  color: var(--el-table-text-color) !important;
}
:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--el-table-border-color) !important;
}

/* 消息框的暗色模式样式 */
:deep(.el-message-box) {
  background-color: #1F2937 !important;
  border-color: #4B5563 !important;
  color: #E5E7EB !important;
}
:deep(.el-message-box__title) {
  color: #E5E7EB !important;
}
:deep(.el-message-box__message p) {
  color: #D1D5DB !important;
}
:deep(.el-message-box__input) {
  background-color: #374151 !important;
  border-color: #4B5563 !important;
}
:deep(.el-message-box__input .el-input__inner) {
  color: #E5E7EB !important;
}
</style>

