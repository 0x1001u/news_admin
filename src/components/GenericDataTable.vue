<template>
  <div>
    <el-table
      :data="data"
      v-loading="loading"
      element-loading-text="加载中..."
      class="generic-data-table"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      :cell-style="cellStyle"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
      >
        <template #default="scope">
          <!-- 优先使用具名插槽 -->
          <slot v-if="$slots[`column-${col.prop}`]" :name="`column-${col.prop}`" :row="scope.row" />
          <!-- 其次使用自定义渲染函数 -->
          <template v-else-if="col.render">
            {{ col.render(scope.row) }}
          </template>
          <!-- 默认渲染 -->
          <span v-else>
            {{ scope.row[col.prop] }}
          </span>
        </template>
      </el-table-column>
      
      <!-- 操作列插槽 -->
      <el-table-column v-if="$slots.default" label="操作" width="180">
        <template #default="scope">
          <slot :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="showPagination"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  headerCellStyle: {
    type: Object,
    default: () => ({ 
      background: '#374151', 
      color: '#E5E7EB', 
      borderBottom: '1px solid #4B5563' 
    })
  },
  rowStyle: {
    type: Object,
    default: () => ({ background: '#1F2937' })
  },
  cellStyle: {
    type: Object,
    default: () => ({ borderBottom: '1px solid #4B5563' })
  }
});

const emit = defineEmits(['page-change']);

const handleSizeChange = (size) => {
  emit('page-change', { 
    page: props.pagination.currentPage, 
    size 
  });
};

const handleCurrentChange = (page) => {
  emit('page-change', { 
    page, 
    size: props.pagination.pageSize 
  });
};
</script>

<style scoped>
.generic-data-table {
  width: 100%;
  background-color: #1F2937;
  color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table) {
  --el-table-bg-color: #1F2937;
  --el-table-row-hover-bg-color: #374151;
  --el-table-border-color: #4B5563;
  --el-table-text-color: #E5E7EB;
  --el-table-header-bg-color: #374151;
  --el-table-header-text-color: #D1D5DB;
}

:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-header-bg-color) !important;
  color: var(--el-table-header-text-color) !important;
  border-bottom: 1px solid var(--el-table-border-color) !important;
}

:deep(.el-table tr) {
  background-color: var(--el-table-bg-color) !important;
  color: var(--el-table-text-color) !important;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--el-table-border-color) !important;
}
</style>