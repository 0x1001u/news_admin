<template>
  <div class="news-list">
    <el-card>
      <div class="filter-container">
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" />
        <el-select v-model="listQuery.category" placeholder="分类" clearable>
          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态" clearable>
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="已归档" value="archived" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>

      <el-table :data="list" border>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category.name" label="分类" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ row.status | statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="published_at" label="发布时间" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'published' ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'published' ? '归档' : '发布' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination 
          :current-page="listQuery.page"
          :page-size="listQuery.limit"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getNewsList, deleteNews, updateNewsStatus } from '@/services/news';
import { getCategories } from '@/services/categories';

export default defineComponent({
  name: 'NewsList',
  setup() {
    const router = useRouter();
    const list = ref([]);
    const total = ref(0);
    const categories = ref([]);
    
    const listQuery = reactive({
      page: 1,
      limit: 20,
      title: '',
      category: '',
      status: '',
      tags: []
    });

    const fetchData = async () => {
      try {
        const response = await getNewsList(listQuery);
        list.value = response.data.items;
        total.value = response.data.total;
      } catch (error) {
        ElMessage.error('获取新闻列表失败');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        categories.value = response.data;
      } catch (error) {
        ElMessage.error('获取分类列表失败');
      }
    };

    const handleEdit = (row: any) => {
      router.push(`/news/edit/${row.id}`);
    };

    const handleDelete = (row: any) => {
      ElMessageBox.confirm('确定删除该新闻?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteNews(row.id);
        ElMessage.success('删除成功');
        fetchData();
      });
    };

    const toggleStatus = async (row: any) => {
      const newStatus = row.status === 'published' ? 'archived' : 'published';
      await updateNewsStatus(row.id, newStatus);
      ElMessage.success('状态更新成功');
      fetchData();
    };

    const handlePageChange = (page: number) => {
      listQuery.page = page;
      fetchData();
    };

    const statusTagType = (status: string) => {
      switch (status) {
        case 'published': return 'success';
        case 'draft': return 'info';
        case 'archived': return 'warning';
        default: return '';
      }
    };

    onMounted(() => {
      fetchData();
      fetchCategories();
    });

    return {
      list,
      total,
      categories,
      listQuery,
      fetchData,
      handleEdit,
      handleDelete,
      toggleStatus,
      handlePageChange,
      statusTagType
    };
  },
  filters: {
    statusText(status: string) {
      const statusMap: Record<string, string> = {
        draft: '草稿',
        published: '已发布',
        archived: '已归档'
      };
      return statusMap[status] || status;
    }
  }
});
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>