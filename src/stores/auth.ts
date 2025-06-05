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
        console.info('[Auth] 服务返回Token数据:', tokenData);
        
        // 验证数据类型
        if (typeof tokenData !== 'object' || tokenData === null) {
          throw new Error(`无效的Token数据类型: ${typeof tokenData}`);
        }
        
        // 确保access_token存在
        if (!tokenData.access_token) {
          throw new Error('登录服务未返回access_token');
        }
        
        token.value = tokenData.access_token;
        tokenType.value = tokenData.token_type || 'Bearer'; // 使用响应中的token_type
        console.info('[Auth] Token存储成功:', token.value.slice(0, 8) + '****');
        
        // 立即验证Token
        try {
          const user = await actions.fetchCurrentUser();
          console.info('[Auth] 用户信息获取成功:', user);
          router.push({ name: 'Dashboard' });
          return user;
        } catch (error) {
          console.error('[Auth] 用户信息获取失败:', error);
          throw new Error('用户验证失败');
        }
      } catch (error) {
        console.error('[Auth] 登录流程失败:', error);
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