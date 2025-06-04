import api from './api';

// 分类类型定义
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 获取分类列表
export const getCategories = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get('/categories', { params });
  return response.data;
};

// 获取单个分类
export const getCategory = async (id: number) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// 创建分类
export const createCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/categories', data);
  return response.data;
};

// 更新分类
export const updateCategory = async (id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

// 删除分类
export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};