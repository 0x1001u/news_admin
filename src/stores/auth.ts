import { defineStore } from 'pinia';
import { reactive, toRefs, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import type { AuthState, User } from '@/types';
import { login, getMe } from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = useStorage<string | null>('auth_token', null);
  const state = reactive<AuthState>({
    userData: null
  });

  const actions = {
    async login(credentials: { email: string; password: string }) {
      try {
        const { token: newToken } = await login(credentials);
        token.value = newToken;
        await actions.fetchUser();
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      token.value = null;
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
    isAuthenticated
  };
});