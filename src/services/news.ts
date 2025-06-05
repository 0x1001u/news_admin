import api from './api';
import type { NewsItem, NewsQueryParams, NewsListResponse } from '@/types';
import type { ApiResponse } from '@/types';

// 获取新闻列表
export const getNewsList = async (params: NewsQueryParams = {}) => {
  // 设置默认参数
  const defaultParams = {
    page: 1,
    per_page: 20,
    status: 'published',
    sort_by: 'published_at',
    sort_order: 'desc'
  };
  
  // 合并参数
  const mergedParams = { ...defaultParams, ...params };
  
  // 构建查询参数对象
  const queryParams: Record<string, any> = { ...mergedParams };
  
  // 移除空值参数
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] === '' || queryParams[key] === null) {
      delete queryParams[key];
    }
  });

  try {
    const response = await api.get<NewsListResponse>('/news', { params: queryParams });
    return response;
  } catch (error) {
    throw new Error('获取新闻列表失败');
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
// 更新新闻状态
export const updateNewsStatus = async (id: number, status: string): Promise<ApiResponse<void>> => {
  try {
    const response = await api.patch(`/news/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update news status');
  }
};
// 获取单个新闻（别名函数）
export const getNewsById = getNews;