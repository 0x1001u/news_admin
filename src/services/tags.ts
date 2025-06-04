import api from './api';

// 标签类型定义
export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// 获取标签列表
export const getTags = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get('/tags', { params });
  return response.data;
};

// 获取单个标签
export const getTag = async (id: number) => {
  const response = await api.get(`/tags/${id}`);
  return response.data;
};

// 创建标签
export const createTag = async (data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/tags', data);
  return response.data;
};

// 更新标签
export const updateTag = async (id: number, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const response = await api.put(`/tags/${id}`, data);
  return response.data;
};

// 删除标签
export const deleteTag = async (id: number) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

export const tagService = {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag
};