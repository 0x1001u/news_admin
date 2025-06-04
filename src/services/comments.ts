import api from './api';

// 评论类型定义
export interface Comment {
  id: number;
  content: string;
  newsId: number;
  authorId: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

// 获取评论列表（可按新闻ID过滤）
export const getComments = async (params?: {
  page?: number;
  limit?: number;
  newsId?: number;
}) => {
  const response = await api.get('/comments', { params });
  return response.data;
};

// 获取单个评论
export const getComment = async (id: number) => {
  const response = await api.get(`/comments/${id}`);
  return response.data;
};

// 创建评论
export const createComment = async (data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/comments', data);
  return response.data;
};

// 更新评论
export const updateComment = async (id: number, data: Partial<Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'newsId' | 'authorId'>>) => {
  const response = await api.put(`/comments/${id}`, data);
  return response.data;
};

// 删除评论
export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

export const commentService = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment
};