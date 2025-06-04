import api from './api';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
import type { Token } from '@/types/auth';

export const login = async (credentials: { username: string; password: string }): Promise<Token> => {
  try {
    // 精确匹配API要求的参数名
    const params = new URLSearchParams();
    params.append('body.username', credentials.username);
    params.append('body.password', credentials.password);
    params.append('body.grant_type', 'password');
    
    const response = await api.post('/api/v1/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data;
  } catch (error: any) {
    let errorMsg = 'Login failed';
    if (error.response?.data?.detail) {
      errorMsg = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map((err: any) => err.msg).join('; ')
        : error.response.data.detail;
    }
    throw new Error(errorMsg);
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
