<template>
  <el-card class="box-card !bg-gray-800 !border-gray-700 !text-gray-50 rounded-lg shadow-md">
    <template #header>
      <div class="card-header flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-primary-500">新闻管理</h2>
        <div class="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <el-input
            v-model="searchQuery"
            placeholder="搜索新闻标题..."
            clearable
            class="!w-full md:!w-64"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <el-select v-model="filterStatus" placeholder="筛选状态" clearable class="!w-full md:!w-40" @change="handleFilter">
            <el-option label="草稿" value="draft"></el-option>
            <el-option label="已发布" value="published"></el-option>
            <el-option label="已归档" value="archived"></el-option>
          </el-select>
          <el-button type="primary" @click="goToCreateNews" class="!w-full md:!w-auto">发布新新闻</el-button>
        </div>
      </div>
    </template>

    <div v-loading="loading" element-loading-text="加载中..." class="min-h-64">
      <el-table :data="newsList" style="width: 100%" class="!bg-gray-800 !text-gray-50 !border-gray-700 rounded-md"
                :header-cell-style="{ background: '#374151', color: '#E5E7EB', borderBottom: '1px solid #4B5563' }"
                :row-style="{ background: '#1F2937' }"
                :cell-style="{ borderBottom: '1px solid #4B5563' }"
      >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="作者">
            <template #default="scope">{{ scope.row.author ? scope.row.author.username : '未知' }}</template>
        </el-table-column>
        <el-table-column label="分类">
            <template #default="scope">{{ scope.row.category ? scope.row.category.name : '无' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="view_count" label="浏览" width="80"></el-table-column>
        <el-table-column prop="published_at" label="发布时间" width="180">
          <template #default="scope">
            {{ scope.row.published_at ? formatDate(scope.row.published_at) : '未发布' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-popconfirm
              title="确定要删除这条新闻吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!newsList.length && !loading" description="暂无新闻数据" class="text-gray-400" />
    </div>

    <el-pagination
      v-if="total > pageSize"
      background
      layout="prev, pager, next, sizes, total"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      class="mt-6 justify-end"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import apiClient from '../../services/api'; // 确保导入了实际的 API 客户端

const router = useRouter();
const newsList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchQuery = ref('');
const filterStatus = ref('');

const fetchNews = async () => {
  loading.value = true;
  try {
    const params = {
      skip: (currentPage.value - 1) * pageSize.value,
      limit: pageSize.value,
      q: searchQuery.value, // 用于全文搜索
      status: filterStatus.value, // 用于状态筛选
    };
    const response = await apiClient.get('/news/', { params });
    newsList.value = response.data;
    // 后端如果支持 X-Total-Count 头，可以获取总数
    total.value = parseInt(response.headers['x-total-count'] || response.data.length, 10);
  } catch (error) {
    ElMessage.error('获取新闻列表失败！');
    console.error('Failed to fetch news:', error);
  } finally {
    loading.value = false;
  }
};

const goToCreateNews = () => {
  router.push('/news/new');
};

const handleEdit = (id) => {
  router.push(`/news/edit/${id}`);
};

const handleDelete = async (id) => {
  ElMessageBox.confirm('确定要删除此新闻吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'dark-message-box' // 为暗色模式添加自定义类
  }).then(async () => {
    try {
      await apiClient.delete(`/news/${id}`);
      ElMessage.success('新闻删除成功！');
      fetchNews(); // 重新加载列表
    } catch (error) {
      ElMessage.error('删除新闻失败！');
      console.error('Failed to delete news:', error);
    }
  }).catch(() => {
    ElMessage.info('已取消删除。');
  });
};

const handlePageChange = (val) => {
  currentPage.value = val;
  fetchNews();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 页大小改变后重置到第一页
  fetchNews();
};

const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  fetchNews();
};

const handleFilter = () => {
  currentPage.value = 1; // 筛选时重置到第一页
  fetchNews();
};

const getStatusTagType = (status) => {
  switch (status) {
    case 'published': return 'success';
    case 'draft': return 'info';
    case 'archived': return 'warning';
    default: return '';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'published': return '已发布';
    case 'draft': return '草稿';
    case 'archived': return '已归档';
    default: return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
/* Element Plus 组件的自定义样式，确保暗色模式下也好看 */
/* 使用 :deep() 穿透 Element Plus 组件的 Shadow DOM */

/* 卡片背景和边框 */
:deep(.el-card) {
  background-color: #1F2937 !important; /* bg-gray-800 */
  border-color: #374151 !important; /* border-gray-700 */
  color: #E5E7EB !important; /* text-gray-50 */
}

/* 输入框和选择器背景、文本颜色 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #374151 !important; /* bg-gray-700 */
  box-shadow: none !important;
  border: 1px solid #4B5563 !important; /* border-gray-600 */
}
:deep(.el-input__inner),
:deep(.el-select__placeholder),
:deep(.el-select__suffix) {
  color: #E5E7EB !important; /* text-gray-50 */
}
:deep(.el-input__inner::placeholder) {
  color: #9CA3AF !important; /* text-gray-400 */
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

/* 确保分页组件在暗色模式下样式正确 */
:deep(.el-pagination) {
  --el-pagination-bg-color: #1F2937;
  --el-pagination-text-color: #E5E7EB;
  --el-pagination-hover-color: #DC2626; /* 主色用于悬停 */
  --el-pagination-button-bg-color: #374151;
  --el-pagination-border-radius: 0.25rem; /* rounded-md */
}
:deep(.el-pager li) {
  background-color: #374151 !important; /* bg-gray-700 */
  color: #E5E7EB !important; /* text-gray-50 */
  border-radius: 0.25rem; /* rounded-md */
}
:deep(.el-pager li.is-active) {
  background-color: #DC2626 !important; /* primary-600 */
  color: #FFFFFF !important;
}
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background-color: #374151 !important;
  color: #E5E7EB !important;
  border-radius: 0.25rem;
}
:deep(.el-pagination .el-select .el-input__wrapper) {
  background-color: #374151 !important;
  border: 1px solid #4B5563 !important;
}
:deep(.el-pagination .el-select .el-input__inner) {
  color: #E5E7EB !important;
}
:deep(.el-pagination__total),
:deep(.el-pagination__sizes) {
    color: #E5E7EB !important;
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

