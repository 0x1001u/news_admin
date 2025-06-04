import { defineStore } from 'pinia';
import { User } from '../types';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    total: 0
  }),
  actions: {
    async fetchUsers(params: any) {
      // TODO: 实现获取用户列表逻辑
    },
    async createUser(userData: User) {
      // TODO: 实现创建用户逻辑
    },
    async deleteUser(id: number) {
      // TODO: 实现删除用户逻辑
    }
  }
});