import axios from 'axios';
import type { ApiResponse, DashboardStats, Activity } from '@/types';
import { useAuthStore } from '@/stores/auth';

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

// 恢复请求拦截器
api.interceptors.request.use(config => {
  const authStore = useAuthStore();
  if (authStore.token) {
    // 规范化Token类型
    const tokenType = authStore.tokenType
      ? authStore.tokenType.charAt(0).toUpperCase() + authStore.tokenType.slice(1).toLowerCase()
      : 'Bearer';
      
    config.headers.Authorization = `${tokenType} ${authStore.token}`;
    console.debug('[API] 设置Authorization头:', config.headers.Authorization);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 恢复响应拦截器
api.interceptors.response.use(response => {
  console.debug('[API] 响应成功:', response.config.url, response.status);
  console.log('[API 完整响应]', {
    data: response.data,
    headers: response.headers,
    status: response.status
  });
  return response;
}, error => {
  console.error('[API 错误]', error);
  return Promise.reject(error);
});


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
