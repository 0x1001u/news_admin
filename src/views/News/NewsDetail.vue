<template>
  <div class="news-detail">
    <el-card>
      <div class="news-header">
        <h1>{{ news.title }}</h1>
        <div class="meta">
          <el-tag :type="statusTagType(news.status)">{{ news.status | statusText }}</el-tag>
          <span class="category">{{ news.category?.name }}</span>
          <span class="date">{{ news.published_at | formatDate }}</span>
        </div>
        <div class="tags">
          <el-tag 
            v-for="tag in news.tags" 
            :key="tag.id" 
            type="info"
            style="margin-right: 5px;"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
      
      <div class="content" v-html="news.content"></div>
      
      <div class="actions" v-if="isAdmin">
        <el-button type="primary" @click="handleEdit">编辑新闻</el-button>
        <el-button type="danger" @click="handleDelete">删除新闻</el-button>
        <el-button 
          :type="news.status === 'published' ? 'warning' : 'success'"
          @click="toggleStatus"
        >
          {{ news.status === 'published' ? '归档' : '发布' }}
        </el-button>
      </div>
      
      <div class="comments">
        <h2>评论 ({{ comments.length }})</h2>
        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="username">{{ comment.user?.name || '匿名用户' }}</span>
              <span class="date">{{ comment.created_at | formatDate }}</span>
              <el-button 
                v-if="isAdmin" 
                type="danger" 
                size="mini" 
                @click="deleteComment(comment.id)"
              >
                删除
              </el-button>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getNewsById, deleteNews, updateNewsStatus } from '@/services/news';
import { getCommentsByNewsId, deleteComment } from '@/services/comments';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'NewsDetail',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    
    const news = reactive({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: '',
      published_at: '',
      category: null,
      tags: []
    });
    
    const comments = ref([]);
    const isAdmin = computed(() => authStore.user?.role === 'admin');
    
    const fetchNews = async (id: string) => {
      try {
        const response = await getNewsById(id);
        Object.assign(news, response.data);
      } catch (error) {
        ElMessage.error('获取新闻详情失败');
      }
    };
    
    const fetchComments = async (id: string) => {
      try {
        const response = await getCommentsByNewsId(id);
        comments.value = response.data;
      } catch (error) {
        ElMessage.error('获取评论失败');
      }
    };
    
    const handleEdit = () => {
      router.push(`/news/edit/${news.id}`);
    };
    
    const handleDelete = () => {
      ElMessageBox.confirm('确定删除该新闻? 此操作不可恢复!', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteNews(news.id);
        ElMessage.success('删除成功');
        router.push('/news');
      });
    };
    
    const toggleStatus = async () => {
      const newStatus = news.status === 'published' ? 'archived' : 'published';
      await updateNewsStatus(news.id, newStatus);
      ElMessage.success('状态更新成功');
      news.status = newStatus;
    };
    
    const handleDeleteComment = async (commentId: string) => {
      ElMessageBox.confirm('确定删除该评论?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteComment(commentId);
        ElMessage.success('评论删除成功');
        fetchComments(news.id);
      });
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
      const newsId = route.params.id as string;
      fetchNews(newsId);
      fetchComments(newsId);
    });
    
    return {
      news,
      comments,
      isAdmin,
      handleEdit,
      handleDelete,
      toggleStatus,
      deleteComment: handleDeleteComment,
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
    },
    formatDate(dateString: string) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString();
    }
  }
});
</script>

<style scoped>
.news-detail {
  padding: 20px;
}
.news-header {
  margin-bottom: 30px;
}
.news-header h1 {
  margin-bottom: 10px;
}
.meta {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}
.meta > * {
  margin-right: 15px;
}
.tags {
  margin-bottom: 20px;
}
.content {
  margin-bottom: 40px;
  line-height: 1.8;
}
.actions {
  margin-bottom: 30px;
}
.comments h2 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.comment-item {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.comment-header > * {
  margin-right: 10px;
}
.username {
  font-weight: bold;
}
.date {
  color: #888;
  font-size: 0.9em;
}
.comment-content {
  line-height: 1.6;
}
</style>