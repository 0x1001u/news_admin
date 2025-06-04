import { defineStore } from 'pinia';
import { reactive, toRefs, computed } from 'vue';
import type { AuthState, User } from '@/types';
import { login, getMe } from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    token: null,
    userData: null
  });

  const actions = {
    async login(credentials: { email: string; password: string }) {
      try {
        const { token } = await login(credentials);
        state.token = token;
        await actions.fetchUser();
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      state.token = null;
      state.userData = null;
    },
    async fetchUser() {
      if (!state.token) return;
      try {
        const userData = await getMe();
        state.userData = userData as User;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
      }
    }
  };

  const isAuthenticated = computed(() => !!state.token);

  return {
    ...toRefs(state),
    ...actions,
    isAuthenticated
  };
});