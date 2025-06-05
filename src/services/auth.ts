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
    params.append('grant_type', '');
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('scope', '');
    params.append('client_id', '');
    params.append('client_secret', '');
    
    // 绕过拦截器直接获取原始响应
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformResponse: [(data) => data] // 禁用默认JSON解析
    });
    
    console.debug('[Auth] 原始响应数据:', response.data);
    
    // 手动解析JSON
    let responseData;
    try {
      responseData = JSON.parse(response.data);
    } catch (error) {
      console.error('[Auth] JSON解析失败:', error);
      throw new Error('响应格式无效');
    }
    
    if (!responseData.access_token) {
      console.error('[Auth] 响应缺少access_token:', responseData);
      throw new Error('登录响应缺少access_token');
    }
    
    return {
      access_token: responseData.access_token,
      token_type: responseData.token_type || 'bearer'
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
