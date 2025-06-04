import { defineStore } from 'pinia';
import { reactive, toRefs, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import type { AuthState, User } from '@/types';
import type { Token } from '@/types/auth';
import { login as loginService, getMe } from '@/services/auth';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const token = useStorage<string | null>('auth_token', null);
  const tokenType = useStorage<string | null>('auth_token_type', null); // 新增tokenType
  const state = reactive<AuthState>({
    userData: null
  });

  const actions = {
    async login(credentials: { email: string; password: string }) {
      try {
        const tokenData = await loginService(credentials) as Token;
        token.value = tokenData.access_token;
        tokenType.value = tokenData.token_type; // 存储token_type
        await actions.fetchUser();
        router.push({ name: 'Dashboard' });
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      token.value = null;
      tokenType.value = null; // 清除token_type
      state.userData = null;
    },
    async fetchUser() {
      if (!token.value) return;
      try {
        const userData = await getMe();
        state.userData = userData as User;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
      }
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    ...toRefs(state),
    ...actions,
    token,
    tokenType, // 返回tokenType
    isAuthenticated
  };
});