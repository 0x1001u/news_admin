<template>
  <div class="news-list">
    <el-card>
      <div class="filter-container">
        <el-row :gutter="20" class="filter-bar">
          <el-col :span="6">
            <el-input v-model="queryParams.title" placeholder="标题" style="width: 200px;" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="queryParams.category_id" placeholder="分类" clearable>
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="queryParams.tag_id" placeholder="标签" clearable>
              <!-- TODO: 添加标签选项 -->
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="queryParams.status" placeholder="状态" clearable>
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="sort-bar">
          <el-radio-group v-model="queryParams.sort_by">
            <el-radio-button label="published_at">发布时间</el-radio-button>
            <el-radio-button label="view_count">浏览量</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="queryParams.sort_order">
            <el-radio-button label="desc">降序</el-radio-button>
            <el-radio-button label="asc">升序</el-radio-button>
          </el-radio-group>
        </el-row>
      </div>

      <div class="table-container">
        <table class="header-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
        <RecycleScroller
          class="scroller"
          :items="newsStore.newsList"
          :item-size="72"
          key-field="id"
          v-loading="loading"
        >
          <template v-slot="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.category?.name }}</td>
              <td>
                <el-tag :type="statusTagType(item.status)">{{ formatStatus(item.status) }}</el-tag>
              </td>
              <td>{{ item.published_at }}</td>
              <td>
                <el-button size="small" @click="handleEdit(item)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(item)">删除</el-button>
                <el-button
                  size="small"
                  :type="item.status === 'published' ? 'warning' : 'success'"
                  @click="toggleStatus(item)"
                >
                  {{ item.status === 'published' ? '归档' : '发布' }}
                </el-button>
              </td>
            </tr>
          </template>
        </RecycleScroller>
      </div>
      <el-empty v-if="!loading && newsStore.newsList.length === 0" description="暂无数据" />

      <el-pagination
        v-model:current-page="queryParams.page"
        :page-size="queryParams.per_page"
        layout="total, prev, pager, next"
        :total="newsStore.total"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteNews, updateNewsStatus } from '@/services/news';
import { getCategories } from '@/services/categories';
import { useNewsStore } from '@/stores/newsStore';

// 新闻状态文本格式化
const formatStatus = (status: string) => {
  switch (status) {
    case 'draft':
      return '草稿';
    case 'published':
      return '已发布';
    case 'archived':
      return '已归档';
    default:
      return status;
  }
};

export default defineComponent({
  name: 'NewsList',
  setup() {
    const router = useRouter();
    const newsStore = useNewsStore();
    const categories = ref<{id: number; name: string}[]>([]);
    const loading = ref(false);
    
    const queryParams = reactive({
      page: 1,
      per_page: 20,
      title: '',
      category_id: null as number | null,
      tag_id: null as number | null,
      status: 'published' as 'published' | 'draft' | 'archived' | null,
      sort_by: 'published_at' as 'published_at' | 'view_count',
      sort_order: 'desc' as 'asc' | 'desc'
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        await newsStore.fetchNews(queryParams);
      } catch (error) {
        ElMessage.error('获取新闻列表失败');
      } finally {
        loading.value = false;
      }
    };

    const handlePageChange = (newPage: number) => {
      queryParams.page = newPage;
      fetchData();
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

    watch(queryParams, () => {
      fetchData();
    }, { deep: true });

    return {
      categories,
      queryParams,
      newsStore,
      fetchData,
      handleEdit,
      handleDelete,
      toggleStatus,
      statusTagType,
      loading,
      formatStatus,
      handlePageChange
    };
  }
});
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.table-container {
  display: flex;
  flex-direction: column;
}

.header-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.header-table th {
  background-color: #f5f7fa;
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
}

.scroller {
  height: calc(100vh - 300px);
  overflow-y: auto;
}

.scroller tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.scroller tr td {
  padding: 12px 15px;
  border-bottom: 1px solid #ebeef5;
}
</style>
