import { defineStore } from 'pinia';
import { NewsItem } from '../types';

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [] as NewsItem[],
    currentNews: null as NewsItem | null
  }),
  actions: {
    async fetchNews(params: any) {
      // TODO: 实现获取新闻列表逻辑
    },
    async getNewsDetail(id: number) {
      // TODO: 实现获取新闻详情逻辑
    }
  }
});