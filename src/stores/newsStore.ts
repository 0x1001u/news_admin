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
        this.newsList = response.data.items;
        this.total = parseInt(response.headers['x-total-count']); // 从headers获取总条数
      } catch (error) {
        console.error('获取新闻列表失败', error);
      }
    },
    async getNewsDetail(id: number) {
      // TODO: 实现获取新闻详情逻辑
    }
  }
});