<template>
    <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-md">
        <template #header>
            <div class="card-header flex justify-between items-center">
                <h2 class="text-xl font-semibold text-primary-500">分类管理</h2>
                <el-button type="primary" @click="openCategoryDialog()">新增分类</el-button>
            </div>
        </template>

        <div v-loading="loading" element-loading-text="加载中..." class="min-h-64">
            <el-table :data="categories" style="width: 100%" class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-md"
                    :header-cell-style="{ background: '#374151', color: '#E5E7EB', borderBottom: '1px solid #4B5563' }"
                    :row-style="{ background: '#1F2937' }"
                    :cell-style="{ borderBottom: '1px solid #4B5563' }"
            >
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="slug" label="别名"></el-table-column>
                <el-table-column label="父分类">
                    <template #default="scope">{{ scope.row.parent_id ? categories.find(c => c.id === scope.row.parent_id)?.name : '无' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button size="small" @click="openCategoryDialog(scope.row)">编辑</el-button>
                        <el-popconfirm
                            title="确定要删除此分类吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="deleteCategory(scope.row.id)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-empty v-if="!categories.length && !loading" description="暂无分类数据" class="text-gray-400" />
        </div>

        <el-dialog v-model="categoryDialogVisible" :title="currentCategoryId ? '编辑分类' : '新增分类'" width="500px"
                   class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-lg shadow-xl">
            <template #header="{ close, titleId, title }">
                <div class="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                    <span :id="titleId" class="text-lg font-semibold text-primary-500">{{ title }}</span>
                    <el-button link type="info" @click="close">
                        <el-icon><Close /></el-icon>
                    </el-button>
                </div>
            </template>
            <el-form :model="categoryForm" label-width="80px" class="p-4">
                <el-form-item label="名称">
                    <el-input v-model="categoryForm.name" class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="别名">
                    <el-input v-model="categoryForm.slug" class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="categoryForm.description" rows="3" class="!bg-gray-700 !text-gray-50"></el-input>
                </el-form-item>
                <el-form-item label="父分类">
                    <el-select v-model="categoryForm.parent_id" placeholder="选择父分类" clearable class="!w-full !bg-gray-700 !text-gray-50">
                        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer px-4 py-2 border-t border-gray-700 flex justify-end space-x-2">
                    <el-button @click="categoryDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitCategoryForm">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端
import { Close } from '@element-plus/icons-vue'; // 导入关闭图标

const categories = ref([]);
const categoryDialogVisible = ref(false);
const categoryForm = reactive({
    name: '',
    slug: '',
    description: '',
    parent_id: null
});
const currentCategoryId = ref(null);
const loading = ref(false);

const fetchCategories = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get('/categories/');
        categories.value = response.data;
    } catch (error) {
        ElMessage.error('获取分类列表失败！');
        console.error('Failed to fetch categories:', error);
    } finally {
        loading.value = false;
    }
};

const openCategoryDialog = (category = null) => {
    if (category) {
        currentCategoryId.value = category.id;
        Object.assign(categoryForm, category);
    } else {
        currentCategoryId.value = null;
        Object.assign(categoryForm, { name: '', slug: '', description: '', parent_id: null });
    }
    categoryDialogVisible.value = true;
};

const submitCategoryForm = async () => {
    try {
        if (currentCategoryId.value) {
            await apiClient.put(`/categories/${currentCategoryId.value}`, categoryForm);
            ElMessage.success('分类更新成功！');
        } else {
            await apiClient.post('/categories/', categoryForm);
            ElMessage.success('分类创建成功！');
        }
        categoryDialogVisible.value = false;
        fetchCategories();
    } catch (error) {
        ElMessage.error('保存分类失败。');
        console.error('Failed to save category:', error);
    }
};

const deleteCategory = async (id) => {
    ElMessageBox.confirm('确定要删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dark-message-box' // 为暗色模式添加自定义类
    }).then(async () => {
        try {
            await apiClient.delete(`/categories/${id}`);
            ElMessage.success('分类删除成功！');
            fetchCategories();
        } catch (error) {
            ElMessage.error('删除分类失败！');
            console.error('Failed to delete category:', error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchCategories);
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

