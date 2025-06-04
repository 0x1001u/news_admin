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
          :items="list"
          :item-size="72"
          key-field="id"
        >
          <template v-slot="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.category?.name }}</td>
              <td>
                <el-tag :type="statusTagType(item.status)">{{ item.status | statusText }}</el-tag>
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
      limit: 500,
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
// 性能验证说明：
  // 1. 确保后端API支持返回500条数据
  // 2. 在浏览器开发者工具中打开Performance面板
  // 3. 滚动列表并记录性能指标
  // 4. 重点关注FPS、布局和渲染时间
  // 5. 与未使用虚拟滚动前进行对比
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