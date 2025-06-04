import api from './api';

// 用户注册
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (credentials: { username: string; password: string }) => {
  try {
    // 创建URL编码的请求体
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 修正请求头
      }
    });
    
    return response.data.access_token;
  } catch (error: any) {
    // 输出详细错误信息
    console.error('Login error details:', error.response?.data);
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
