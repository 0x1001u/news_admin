import { getToken } from '../../utils/cookie';

/**
 * 认证拦截器
 * @param {Object} config - 请求配置
 * @returns {Object} 修改后的请求配置
 */
export default function authInterceptor(config) {
  const token = getToken();
  console.log('[AuthInterceptor] Full config:', config);
  console.log('[AuthInterceptor] Token existence:', !!token);
  
  if (token) {
    console.log('[AuthInterceptor] Token:', token);
    console.log('[AuthInterceptor] Request headers:', config.headers);
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}
