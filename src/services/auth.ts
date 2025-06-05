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
    const params = new URLSearchParams();
    // 精确匹配curl参数
    params.append('grant_type', ''); // 空值
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('scope', ''); // 空值
    params.append('client_id', ''); // 空值
    params.append('client_secret', ''); // 空值
    
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
// 严格验证响应结构
    if (!response.data.access_token) {
      console.error('登录响应缺少access_token:', response.data);
      throw new Error('登录响应缺少access_token');
    }
    // Map the response to the Token interface
    return {
      access_token: response.data.token,
      token_type: response.data.token_type || 'bearer'
    };
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

// 验证Token
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

// 添加Token刷新方法
export const refreshToken = async () => {
  try {
    const response = await api.post('/api/v1/auth/refresh', {
      refresh_token: localStorage.getItem('refresh_token')
    });
    return response.data;
  } catch (error) {
    throw new Error('Token refresh failed');
  }
};
