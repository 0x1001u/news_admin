import api from './api';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
import type { Token } from '@/types/auth';

export const login = async (credentials: { email: string; password: string }): Promise<Token> => {
  try {
    const params = new URLSearchParams();
    params.append('email', credentials.email);
    params.append('password', credentials.password);

    const response = await api.post('/api/v1/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // 返回完整Token对象
    return {
      access_token: response.data.token,
      token_type: response.data.token_type || 'Bearer' // 默认值
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data);
    throw new Error('Login failed: ' + (error.response?.data?.detail || error.message));
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
