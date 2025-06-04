<template>
  <div class="comment-list">
    <!-- 搜索过滤区域 -->
    <div class="filter-container">
      <el-input v-model="filter.news" placeholder="按新闻标题过滤" style="width: 200px;" />
      <el-input v-model="filter.author" placeholder="按作者过滤" style="width: 200px; margin-left: 10px;" />
      <el-select v-model="filter.status" placeholder="状态过滤" style="width: 120px; margin-left: 10px;">
        <el-option label="全部" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-button type="primary" style="margin-left: 10px;" @click="fetchComments">搜索</el-button>
    </div>

    <!-- 评论表格 -->
    <el-table :data="comments" style="width: 100%" border>
      <el-table-column prop="content" label="评论内容" min-width="200" />
      <el-table-column prop="newsTitle" label="关联新闻" width="180" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="createdAt" label="时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row.id)">查看详情</el-button>
          <el-button 
            size="small" 
            type="success" 
            v-if="row.status !== 'approved'"
            @click="approveComment(row.id)"
          >通过</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteComment(row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="fetchComments"
      @size-change="fetchComments"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getComments, deleteComment as apiDeleteComment, approveComment as apiApproveComment } from '@/services/comments'
import type { Comment } from '@/types'
import { formatDate } from '@/utils/date'

const router = useRouter()

// 过滤条件
const filter = ref({
  news: '',
  author: '',
  status: ''
})

// 分页设置
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0
})

// 评论列表数据
const comments = ref<Comment[]>([])

// 状态标签样式
const statusTagType = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    default: return 'info'
  }
}

// 状态文本
const statusText = (status: string) => {
  switch (status) {
    case 'approved': return '已通过'
    case 'pending': return '待审核'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const response = await getComments({
      page: pagination.value.page,
      limit: pagination.value.limit,
      newsTitle: filter.value.news,
      author: filter.value.author,
      status: filter.value.status
    })
    
    comments.value = response.data
    pagination.value.total = response.total
  } catch (error) {
    ElMessage.error('获取评论列表失败')
    console.error(error)
  }
}

// 查看详情
const viewDetail = (id: number) => {
  router.push(`/comments/${id}`)
}

// 审核通过
const approveComment = async (id: number) => {
  try {
    await apiApproveComment(id)
    ElMessage.success('评论已通过')
    fetchComments()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 删除评论
const deleteComment = (id: number) => {
  ElMessageBox.confirm('确定删除该评论?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await apiDeleteComment(id)
      ElMessage.success('评论已删除')
      fetchComments()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }).catch(() => {})
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
</style>