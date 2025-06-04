<template>
  <div>
    <el-card>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" placeholder="请输入URL标识" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createTag, updateTag, getTag } from '@/services/tags';
import type { Tag } from '@/types';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const isEditMode = ref(false);
const currentId = ref<number | null>(null);

const form = ref<Tag>({
  name: '',
  slug: '',
});

const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: '请输入URL标识', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符(-)', trigger: 'blur' }
  ]
});

// 获取标签详情（编辑模式）
const fetchTag = async (id: number) => {
  try {
    const res = await getTag(id);
    form.value = res.data;
  } catch (error) {
    ElMessage.error('获取标签信息失败');
    goBack();
  }
};

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  try {
    if (isEditMode.value && currentId.value !== null) {
      await updateTag(currentId.value, form.value);
      ElMessage.success('更新成功');
    } else {
      await createTag(form.value);
      ElMessage.success('创建成功');
    }
    goBack();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 返回列表页
const goBack = () => {
  router.push('/tags');
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    isEditMode.value = true;
    currentId.value = Number(id);
    fetchTag(Number(id));
  }
});
</script>