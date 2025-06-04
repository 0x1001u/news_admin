<template>
  <div class="comment-detail">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">评论详情</span>
      </template>
    </el-page-header>

    <el-card class="comment-card" v-if="comment">
      <template #header>
        <div class="card-header">
          <span>{{ comment.author }} 发布于 {{ formatDate(comment.createdAt) }}</span>
          <el-tag :type="statusTagType(comment.status)" size="large">
            {{ statusText(comment.status) }}
          </el-tag>
        </div>
      </template>

      <el-input
        v-model="comment.content"
        type="textarea"
        :rows="4"
        placeholder="请输入评论内容"
        v-if="isEditing"
      />
      <div v-else>{{ comment.content }}</div>

      <div class="news-info">
        关联新闻: 
        <router-link :to="`/news/${comment.newsId}`" target="_blank">
          {{ comment.newsTitle }}
        </router-link>
      </div>

      <div class="actions">
        <el-button 
          type="primary" 
          v-if="!isEditing"
          @click="isEditing = true"
        >编辑内容</el-button>
        <el-button 
          type="primary" 
          v-if="isEditing"
          @click="saveComment"
        >保存修改</el-button>
        <el-button 
          type="success" 
          v-if="comment.status !== 'approved'"
          @click="approveComment"
        >审核通过</el-button>
        <el-button 
          type="warning" 
          v-if="comment.status !== 'rejected'"
          @click="rejectComment"
        >拒绝评论</el-button>
        <el-button 
          type="danger"
          @click="deleteComment"
        >删除评论</el-button>
      </div>
    </el-card>

    <div class="replies-section">
      <h3>回复列表</h3>
      <el-table :data="comment.replies" style="width: 100%">
        <el-table-column prop="author" label="回复人" width="120" />
        <el-table-column prop="content" label="回复内容" />
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteReply(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getCommentDetail, 
  updateComment, 
  deleteComment as apiDeleteComment,
  approveComment as apiApproveComment,
  rejectComment as apiRejectComment,
  deleteReply as apiDeleteReply
} from '@/services/comments'
import type { Comment } from '@/types'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const commentId = ref(parseInt(route.params.id as string))
const comment = ref<Comment | null>(null)
const isEditing = ref(false)

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

// 获取评论详情
const fetchCommentDetail = async () => {
  try {
    const data = await getCommentDetail(commentId.value)
    comment.value = data
  } catch (error) {
    ElMessage.error('获取评论详情失败')
    console.error(error)
  }
}

// 保存评论编辑
const saveComment = async () => {
  if (!comment.value) return
  
  try {
    await updateComment(commentId.value, { content: comment.value.content })
    ElMessage.success('评论更新成功')
    isEditing.value = false
  } catch (error) {
    ElMessage.error('更新失败')
    console.error(error)
  }
}

// 审核通过
const approveComment = async () => {
  try {
    await apiApproveComment(commentId.value)
    ElMessage.success('评论已通过审核')
    fetchCommentDetail()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 拒绝评论
const rejectComment = async () => {
  try {
    await apiRejectComment(commentId.value)
    ElMessage.success('评论已拒绝')
    fetchCommentDetail()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 删除评论
const deleteComment = () => {
  ElMessageBox.confirm('确定删除该评论及其所有回复?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await apiDeleteComment(commentId.value)
      ElMessage.success('评论已删除')
      goBack()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }).catch(() => {})
}

// 删除回复
const deleteReply = (replyId: number) => {
  ElMessageBox.confirm('确定删除该回复?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await apiDeleteReply(commentId.value, replyId)
      ElMessage.success('回复已删除')
      fetchCommentDetail()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }).catch(() => {})
}

// 返回列表页
const goBack = () => {
  router.push('/comments')
}

onMounted(() => {
  fetchCommentDetail()
})
</script>

<style scoped>
.comment-detail {
  padding: 20px;
}

.comment-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-info {
  margin: 15px 0;
  font-size: 14px;
  color: #666;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.replies-section {
  margin-top: 30px;
}
</style>