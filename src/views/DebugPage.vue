<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Debug Information</h1>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Token</h2>
      <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto">{{ token || 'No token found' }}</pre>
    </div>
    
    <div>
      <h2 class="text-xl font-semibold mb-2">User Information</h2>
      <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto">{{ userInfo || 'No user information' }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getToken } from '@/utils/cookie';
import { useAuthStore } from '../../stores/auth';

const token = ref('');
const userInfo = ref('');

onMounted(() => {
  // Get token from cookies
  token.value = getToken();
  
  // Get user information from auth store
  const authStore = useAuthStore();
  userInfo.value = authStore.user ? JSON.stringify(authStore.user, null, 2) : null;
});
</script>