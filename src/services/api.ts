import axios from 'axios';
import type { ApiResponse, DashboardStats, Activity } from '@/types';

declare global {
  interface Window {
    location: Location;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：添加token
/*
import { useAuthStore } from '@/stores/auth';

api.interceptors.request.use(config => {
  const authStore = useAuthStore();
  if (authStore.token) {
    // Normalize token type (capitalize first letter)
    const tokenType = authStore.tokenType
      ? authStore.tokenType.charAt(0).toUpperCase() + authStore.tokenType.slice(1).toLowerCase()
      : 'Bearer';
    const header = `${tokenType} ${authStore.token}`;
    console.debug('[API] Setting Authorization header:', header);
    config.headers.Authorization = header;
  } else {
    console.warn('[API] No token available for request');
  }
  return config;
}, error => {
  console.error('[API] Request interceptor error:', error);
  return Promise.reject(error);
});

// 响应拦截器：处理401错误
api.interceptors.response.use(response => {
  console.debug(`[API] 响应成功: ${response.status} ${response.config.url}`);
  
  // 记录登录响应结构
  if (response.config.url?.includes('/auth/login')) {
    console.debug('[API] 登录响应结构:', JSON.stringify(response.data));
  }
  
  return response;
}, error => {
  console.error('[API] Response error:', error.config?.url, error.response?.status, error.message);
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    // 使用原生跳转避免路由依赖
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
*/

export default api;
// 获取仪表盘统计数据
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard stats');
  }
};

// 获取最近活动
export const getRecentActivities = async (): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get('/dashboard/activities');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch recent activities');
  }
};
