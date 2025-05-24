<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ id ? '编辑标签' : '新增标签' }}</h2>
        <el-form :model="tagForm" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="tagForm.name"></el-input>
            </el-form-item>
            <el-form-item label="别名">
                <el-input v-model="tagForm.slug"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="router.push('/tags')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 修正了这里的语法错误
import { ElMessage } from 'element-plus';
import { tagService } from '../../services/tags'; // 导入实际的标签服务

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id); // Get ID from route params

const tagForm = reactive({
    name: '',
    slug: ''
});

const fetchTagDetail = async () => {
    if (id.value) {
        try {
            const data = await tagService.getTag(parseInt(id.value)); // 调用实际的 API 服务
            Object.assign(tagForm, data);
        } catch (error) {
            console.error("Failed to fetch tag detail:", error);
            ElMessage.error('获取标签详情失败。');
            router.push('/tags'); // 获取失败则返回列表页
        }
    }
};

const submitForm = async () => {
    try {
        if (id.value) {
            await tagService.updateTag(parseInt(id.value), tagForm); // 调用实际的 API 服务
            ElMessage.success('标签更新成功！');
        } else {
            await tagService.createTag(tagForm); // 调用实际的 API 服务
            ElMessage.success('标签创建成功！');
        }
        router.push('/tags');
    } catch (error) {
        console.error("Failed to save tag:", error);
        ElMessage.error('保存标签失败。');
    }
};

onMounted(fetchTagDetail);
</script>

<style scoped>
/* Scoped styles for TagFormPage */
</style>

