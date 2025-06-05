import api from '@/services/api';

export const getDashboardStats = async () => {
  try {
    const [usersRes, newsRes, categoriesRes, tagsRes] = await Promise.all([
      api.get('/users/'),
      api.get('/news'),
      api.get('/categories/'),
      api.get('/tags/')
    ]);
    
    return {
      userCount: usersRes.data.length,
      newsCount: newsRes.data.length,
      categoryCount: categoriesRes.data.length,
      tagCount: tagsRes.data.length
    };
  } catch (error) {
    throw new Error('获取仪表盘数据失败');
  }
};