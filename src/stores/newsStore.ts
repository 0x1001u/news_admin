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
        
        // 根据文档结构处理响应
        if (response.data && response.data.pagination) {
          this.newsList = response.data.data;
          this.total = response.data.pagination.total;
        } else {
          // 兼容旧结构
          this.newsList = response.data.data || response.data;
          this.total = response.data.total || 0;
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