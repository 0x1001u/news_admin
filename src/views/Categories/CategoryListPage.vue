<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">分类管理</h2>
        <el-button type="primary" @click="router.push('/categories/new')">新增分类</el-button>
        <el-table :data="categories" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="slug" label="别名"></el-table-column>
            <el-table-column label="父分类">
                <template #default="scope">{{ scope.row.parent_id ? categories.find(c => c.id === scope.row.parent_id)?.name : '无' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/categories/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { categoryService } from '../../services/categories'; // 导入实际的分类服务

const router = useRouter();
const categories = ref([]);

const fetchCategories = async () => {
    try {
        const data = await categoryService.getCategories(); // 调用实际的 API 服务
        categories.value = data;
    } catch (error) {
        console.error("获取分类列表失败:", error);
        ElMessage.error('获取分类数据失败。');
    }
};

const deleteCategory = async (id) => {
    ElMessageBox.confirm('确定要删除此分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await categoryService.deleteCategory(id); // 调用实际的 API 服务
            ElMessage.success('分类删除成功！');
            fetchCategories(); // 刷新列表
        } catch (error) {
            console.error("删除分类失败:", error);
            ElMessage.error('删除分类失败。');
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchCategories);
</script>

<style scoped>
/* Scoped styles for CategoryListPage */
</style>

