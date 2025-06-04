import api from './api';

// 新闻类型定义
export interface News {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: number[];
}

// 获取新闻列表
export const getNewsList = async (params?: { 
  page?: number; 
  limit?: number;
  categoryId?: number;
  authorId?: number;
}) => {
  const response = await api.get('/news', { params });
  return response.data;
};

// 获取单个新闻
export const getNews = async (id: number) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

// 创建新闻
export const createNews = async (data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>) => {
  const response = await api.post('/news', data);
  return response.data;
};

// 更新新闻
export const updateNews = async (id: number, data: Partial<Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>>) => {
  const response = await api.put(`/news/${id}`, data);
  return response.data;
};

// 删除新闻
export const deleteNews = async (id: number) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};

export const newsService = {
  getNewsList,
  getNews,
  createNews,
  updateNews,
  deleteNews
};