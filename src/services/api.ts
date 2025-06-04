import axios from 'axios';

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
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器：处理401错误
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    // 使用原生跳转避免路由依赖
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;