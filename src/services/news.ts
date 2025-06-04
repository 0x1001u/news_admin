import api from './api';
import type { NewsItem, NewsQueryParams } from '@/types';
import type { ApiResponse } from '@/types';

// 获取新闻列表
export const getNewsList = async (
  params: NewsQueryParams
): Promise<ApiResponse<NewsItem[]>> => {
  try {
    const response = await api.get('/news', { params });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch news');
  }
};

// 获取单个新闻
export const getNews = async (id: number) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

// 创建新闻
export const createNews = async (data: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post('/news', data);
  return response.data;
};

// 更新新闻
export const updateNews = async (id: number, data: Partial<Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>>) => {
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