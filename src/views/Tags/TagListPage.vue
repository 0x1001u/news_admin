<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">标签管理</h2>
        <el-button type="primary" @click="router.push('/tags/new')">新增标签</el-button>
        <el-table :data="tags" style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="slug" label="别名"></el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="router.push('/tags/edit/' + scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteTag(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { tagService } from '../../services/tags'; // 导入实际的标签服务

const router = useRouter();
const tags = ref([]);

const fetchTags = async () => {
    try {
        const data = await tagService.getTags(); // 调用实际的 API 服务
        tags.value = data;
    } catch (error) {
        console.error("获取标签列表失败:", error);
        ElMessage.error('获取标签数据失败。');
    }
};

const deleteTag = async (id) => {
    ElMessageBox.confirm('确定要删除此标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await tagService.deleteTag(id); // 调用实际的 API 服务
            ElMessage.success('标签删除成功！');
            fetchTags(); // 刷新列表
        } catch (error) {
            console.error("删除标签失败:", error);
            ElMessage.error('删除标签失败。');
        }
    }).catch(() => {
        ElMessage.info('已取消删除。');
    });
};

onMounted(fetchTags);
</script>

<style scoped>
/* Scoped styles for TagListPage */
</style>

