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
        const tokenData = await loginService(credentials);
        console.info('[Auth] Login successful. Token data:', tokenData);
        
        token.value = tokenData.token;
        tokenType.value = 'Bearer'; // 默认类型
        console.debug('[Auth] Token stored:', token.value);
        
        // 立即验证Token
        try {
          const user = await actions.fetchCurrentUser();
          console.info('[Auth] User fetched successfully:', user);
          router.push({ name: 'Dashboard' });
          return user;
        } catch (error) {
          console.error('[Auth] User fetch failed:', error);
          throw new Error('User verification failed');
        }
      } catch (error) {
        console.error('[Auth] Login failed:', error);
        token.value = null;
        tokenType.value = null;
        throw error;
      }
    },
    logout() {
      token.value = null;
      tokenType.value = null; // 清除token_type
      state.userData = null;
    },
    async fetchCurrentUser() {
      if (!token.value) return;
      try {
        const userData = await getMe();
        state.userData = userData as User;
      } catch (error) {
        console.error('Failed to fetch current user:', error);
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
    isAuthenticated,
    fetchCurrentUser: actions.fetchCurrentUser
  };
});