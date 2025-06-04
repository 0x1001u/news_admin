<template>
  <div class="news-form">
    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" placeholder="URL友好标识" />
        </el-form-item>
        
        <el-form-item label="摘要" prop="excerpt">
          <el-input 
            v-model="form.excerpt" 
            type="textarea" 
            :rows="3" 
            placeholder="新闻摘要"
          />
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <quill-editor 
            v-model:content="form.content" 
            contentType="html"
            :options="editorOptions"
          />
          <el-upload
            class="image-uploader"
            :action="uploadImageUrl"
            :headers="{ 'Authorization': `Bearer ${token}` }"
            :show-file-list="false"
            :on-success="handleImageUploadSuccess"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="选择分类">
            <el-option 
              v-for="category in categories" 
              :key="category.id" 
              :label="category.name" 
              :value="category.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签" prop="tags">
          <el-select 
            v-model="form.tags" 
            multiple 
            filterable 
            placeholder="选择标签"
          >
            <el-option 
              v-for="tag in tags" 
              :key="tag.id" 
              :label="tag.name" 
              :value="tag.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">已发布</el-radio>
            <el-radio label="archived">已归档</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { createNews, updateNews, getNewsById } from '@/services/news';
import { getCategories } from '@/services/categories';
import { getTags } from '@/services/tags';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'NewsForm',
  components: {
    QuillEditor
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const formRef = ref();
    const isEditMode = computed(() => route.name === 'NewsEdit');
    
    const form = reactive({
      id: null,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: null,
      tags: [],
      status: 'draft'
    });
    
    const categories = ref([]);
    const tags = ref([]);
    
    const rules = {
      title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      slug: [{ required: true, message: 'Slug不能为空', trigger: 'blur' }],
      category_id: [{ required: true, message: '请选择分类', trigger: 'change' }]
    };
    
    const editorOptions = {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ]
      }
    };
    
    const token = computed(() => authStore.token);
    const uploadImageUrl = computed(() => {
      if (!form.id) return '';
      return `/api/v1/news/${form.id}/upload-image`;
    });
    
    const fetchNews = async (id: string) => {
      try {
        const response = await getNewsById(id);
        Object.assign(form, response.data);
      } catch (error) {
        ElMessage.error('获取新闻详情失败');
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
    
    const fetchTags = async () => {
      try {
        const response = await getTags();
        tags.value = response.data;
      } catch (error) {
        ElMessage.error('获取标签列表失败');
      }
    };
    
    const handleImageUploadSuccess = (response: any) => {
      if (response.success) {
        // 将图片插入到编辑器光标位置
        const quill = (document.querySelector('.ql-editor') as any)?.__vue__?.quill;
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, 'image', response.data.url);
          }
        }
      } else {
        ElMessage.error('图片上传失败');
      }
    };
    
    const submitForm = async () => {
      try {
        await formRef.value.validate();
        
        if (isEditMode.value) {
          await updateNews(form.id, form);
          ElMessage.success('新闻更新成功');
        } else {
          const response = await createNews(form);
          form.id = response.data.id;
          ElMessage.success('新闻创建成功');
        }
        
        router.push('/news');
      } catch (error) {
        ElMessage.error('操作失败');
      }
    };
    
    const cancel = () => {
      router.push('/news');
    };
    
    onMounted(() => {
      fetchCategories();
      fetchTags();
      
      if (isEditMode.value) {
        fetchNews(route.params.id as string);
      }
    });
    
    return {
      form,
      formRef,
      rules,
      categories,
      tags,
      editorOptions,
      token,
      uploadImageUrl,
      handleImageUploadSuccess,
      submitForm,
      cancel
    };
  }
});
</script>

<style scoped>
.news-form {
  padding: 20px;
}
.image-uploader {
  margin-top: 10px;
}
</style>