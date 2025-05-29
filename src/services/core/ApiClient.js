import axios from 'axios';
import errorHandler from './ErrorHandler';
import authInterceptor from './AuthInterceptor';

const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
ApiClient.interceptors.request.use(authInterceptor);

// 添加响应拦截器
ApiClient.interceptors.response.use(
  response => response,
  error => errorHandler(error)
);

export default ApiClient;