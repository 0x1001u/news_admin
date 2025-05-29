/**
 * 统一错误处理
 * @param {Error} error - 错误对象
 * @returns {Promise<never>} 拒绝的Promise
 */
export default function errorHandler(error) {
  if (error.response) {
    // 服务器返回错误状态码
    const { status, data } = error.response;
    
    // 根据状态码处理不同错误
    switch (status) {
      case 401:
        console.error('未授权访问:', data.message || '请重新登录');
        // 触发登出逻辑
        break;
      case 403:
        console.error('禁止访问:', data.message || '您没有权限执行此操作');
        break;
      case 404:
        console.error('资源未找到:', data.message || '请求的资源不存在');
        break;
      case 500:
        console.error('服务器错误:', data.message || '服务器内部错误');
        break;
      default:
        console.error(`请求错误 [${status}]:`, data.message || '未知错误');
    }
  } else if (error.request) {
    // 请求已发出但无响应
    console.error('网络错误:', '无法连接到服务器，请检查网络连接');
  } else {
    // 请求配置错误
    console.error('请求配置错误:', error.message);
  }

  // 返回统一的错误对象
  return Promise.reject({
    message: error.response?.data?.message || '请求处理失败',
    code: error.response?.status || 0,
    original: error
  });
}