import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import type { User, UserState } from '@/types';
import { getUsers, updateUser as updateUserService } from '@/services/users';

export const useUserStore = defineStore('user', () => {
  const state = reactive<UserState>({
    userList: [],
    currentUser: null
  });

  const actions = {
    async fetchUsers() {
      try {
        state.userList = await getUsers();
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    async updateUser(userId: number, userData: Partial<User>) {
      try {
        const updatedUser = await updateUserService(userId, userData);
        // 更新用户列表中的用户
        const index = state.userList.findIndex(u => u.id === userId);
        if (index !== -1) {
          state.userList[index] = { ...state.userList[index], ...updatedUser };
        }
        // 如果更新的是当前用户，也更新当前用户数据
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser = { ...state.currentUser, ...updatedUser };
        }
        return updatedUser;
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    }
  };

  return {
    ...toRefs(state),
    ...actions
  };
});