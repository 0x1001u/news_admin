import api from './api';

// 用户类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 获取用户列表
export const getUsers = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// 获取单个用户
export const getUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// 创建用户
export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/users', data);
  return response.data;
};

// 更新用户
export const updateUser = async (id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// 删除用户
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};