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
        this.newsList = response.data.data; // 访问 data.data
        this.total = response.data.pagination.total; // 从分页对象获取总数
      } catch (error) {
        console.error('获取新闻列表失败:', error);
        // 确保在错误时清空列表
        this.newsList = [];
        this.total = 0;
      }
    },
    async getNewsDetail(id: number) {
      // TODO: 实现获取新闻详情逻辑
    }
  }
});