import { defineStore } from 'pinia';
import { NewsItem } from '../types';
import { getNewsList } from '@/services/news';

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [] as NewsItem[], // 确保初始化为空数组
    currentNews: null as NewsItem | null,
    total: 0
  }),
  actions: {
    async fetchNews(params: any) {
      try {
        const response = await getNewsList(params);
        
        // 直接使用响应数据（无分页字段）
        this.newsList = response.data.data;
        
        // 尝试从响应头获取总条数
        this.total = parseInt(response.headers['x-total-count'] || '0', 10);
        
        // 如果响应头没有，使用数组长度作为临时方案
        if (!this.total && Array.isArray(response.data.data)) {
          this.total = response.data.data.length;
        }
      } catch (error) {
        console.error('获取新闻列表失败:', error);
        this.newsList = [];
        this.total = 0;
      }
    },
    async getNewsDetail(id: number) {
      // TODO: 实现获取新闻详情逻辑
    }
  }
});