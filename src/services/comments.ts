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


// 按新闻ID获取评论
export const getCommentsByNewsId = async (newsId: number) => {
  return getComments({ newsId });
};

// 删除评论
export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};
// 批准评论
export const approveComment = async (id: number) => {
  const response = await api.patch(`/comments/${id}/approve`);
  return response.data;
};
// 获取评论详情（别名函数）
export const getCommentDetail = getComment;
// 拒绝评论
export const rejectComment = async (id: number) => {
  const response = await api.patch(`/comments/${id}/reject`);
  return response.data;
};

// 删除回复（复用删除评论函数）
export const deleteReply = deleteComment;