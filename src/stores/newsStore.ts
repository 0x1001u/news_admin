import { defineStore } from 'pinia';
import { NewsItem } from '../types';
import { getNewsList } from '@/services/news';

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [] as NewsItem[],
    currentNews: null as NewsItem | null,
    total: 0 // 添加总条数字段
  }),
  actions: {
    async fetchNews(params: any) {
      try {
        const response = await getNewsList(params);
        this.news = response.data.items;
        this.total = response.data.total;
      } catch (error) {
        console.error('获取新闻列表失败', error);
      }
    },
    async getNewsDetail(id: number) {
      // TODO: 实现获取新闻详情逻辑
    }
  }
});