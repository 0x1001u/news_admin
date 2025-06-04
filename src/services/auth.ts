import api from './api';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', {
      grant_type: 'password', // 添加grant_type
      username: credentials.username,
      password: credentials.password
    });
    // 确保正确获取access_token
    return response.data.access_token;
  } catch (error) {
    throw new Error('Login failed');
  }
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
