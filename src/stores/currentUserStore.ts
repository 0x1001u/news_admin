import { defineStore } from 'pinia';
import { User } from '../types';

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    user: null as User | null,
    permissions: [] as string[]
  }),
  actions: {
    async fetchCurrentUser() {
      // TODO: 实现获取当前用户逻辑
    }
  }
});