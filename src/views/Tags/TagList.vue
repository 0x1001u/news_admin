<template>
  <div>
    <el-card>
      <div class="mb-4">
        <el-button type="primary" @click="goToCreate">添加标签</el-button>
      </div>
      <el-table :data="tagList" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="slug" label="Slug" />
        <el-table-column prop="createdAt" label="创建时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchTags"
          @size-change="fetchTags"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Tag } from '@/types';
import { getTags, deleteTag } from '@/services/tags';

const router = useRouter();
const tagList = ref<Tag[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchTags = async () => {
  try {
    const res = await getTags({
      page: currentPage.value,
      limit: pageSize.value
    });
    tagList.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error('获取标签列表失败');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const goToCreate = () => {
  router.push('/tags/create');
};

const handleEdit = (id: number) => {
  router.push(`/tags/edit/${id}`);
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该标签吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteTag(id);
    ElMessage.success('删除成功');
    fetchTags();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  fetchTags();
});
</script>