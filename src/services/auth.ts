import api from './api';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// 获取当前用户信息
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 更新当前用户信息
export const updateMe = async (data: { username?: string; email?: string; password?: string }) => {
  const response = await api.put('/auth/me', data);
  return response.data;
};
