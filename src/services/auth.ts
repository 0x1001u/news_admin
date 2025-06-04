import api from './api';
import type { Token } from '@/types/auth';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (credentials: { username: string; password: string }): Promise<Token> => {
  try {
    // 使用方括号语法表示嵌套对象
    const params = new URLSearchParams();
    params.append('body[username]', credentials.username);
    params.append('body[password]', credentials.password);
    params.append('body[grant_type]', 'password');
    
    const response = await api.post('/api/v1/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data;
  } catch (error: any) {
    // 错误处理保持不变
    let errorMsg = 'Login failed';
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMsg = error.response.data.detail
          .map((err: any) => `${err.loc.join('.')}: ${err.msg}`)
          .join('; ');
      } else {
        errorMsg = error.response.data.detail;
      }
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
