<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-950 transition-colors duration-300" >
        <el-card class="w-full max-w-sm p-8 shadow-2xl rounded-xl !bg-gray-800 !border-gray-700" style="position: absolute; left: 49%; top: 50%; transform: translate(-50%,-50%); border-radius: 10px; border: 2px solid rgba(255,255,255,0.1);">
            <template #header>
                <div class="text-center text-3xl font-bold text-gray-100 mb-4">Login Here</div>
            </template>
            <el-form @submit.prevent="handleLogin" label-position="top">
                <el-form-item label="Username" class="!text-gray-300">
                    <el-input v-model="form.username" placeholder="Email or Phone" class="!bg-gray-700 !text-gray-50 rounded-md"></el-input>
                </el-form-item>
                <el-form-item label="Password" class="!text-gray-300">
                    <el-input type="password" v-model="form.password" placeholder="Password" show-password class="!bg-gray-700 !text-gray-50 rounded-md"></el-input>
                </el-form-item>
                <el-form-item class="mt-8">
                    <el-button type="default" native-type="submit" class="w-full !bg-white !text-gray-900 !border-white hover:!bg-gray-100 hover:!text-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-gray-900 !font-semibold !py-3 !rounded-md">Log In</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth'; // Ensure auth store is imported
import apiClient from '../../services/api'; // Ensure actual API client is imported

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    username: 'admin', // Default value for testing
    password: 'adminpass' // Default value for testing
});

const handleLogin = async () => {
    try {
        const response = await apiClient.post('/auth/login', new URLSearchParams({
            username: form.username,
            password: form.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Debug: Log login response headers
        console.log('Login response headers:', response.headers);
        console.log('Set-Cookie from login:', response.headers['set-cookie']);

        // Get user info
        const userResponse = await apiClient.get('/auth/me');
        const user = userResponse.data;

        authStore.login(user);
        router.push('/dashboard');

    } catch (error) {
        // Errors are handled in the apiClient interceptor, no additional handling needed here for now, or just for debugging
        console.error('Login failed:', error);
    }
};
</script>

<style scoped>
/* Override Element Plus card and form components styles for dark mode */

:deep(.el-card) {
  background-color: #1F2937 !important; /* Matches image's card background (dark gray) */
  border-color: #374151 !important; /* Slightly lighter border for contrast */
  color: #E5E7EB !important; /* Light text for readability */
}

:deep(.el-form-item__label) {
    color: #D1D5DB !important; /* Lighter gray for labels */
    font-weight: 600; /* Make labels bold */
    margin-bottom: 0.5rem; /* Add some space below labels */
}

:deep(.el-input__wrapper) {
    background-color: #374151 !important; /* Darker background for input fields */
    box-shadow: none !important;
    border: 1px solid #4B5563 !important; /* Border color for input fields */
    border-radius: 0.375rem !important; /* Rounded corners for inputs */
    padding: 0.75rem 1rem !important; /* Adjust padding for input fields */
    height: auto !important; /* Allow height to adjust based on content */
}

:deep(.el-input__inner) {
    color: #E5E7EB !important; /* Light text color for input values */
}

:deep(.el-input__inner::placeholder) {
    color: #9CA3AF !important; /* Lighter placeholder text color */
}

/* Ensure button styles are correct */
:deep(.el-button--default) {
    --el-button-bg-color: #FFFFFF; /* White background for the button */
    --el-button-hover-bg-color: #F3F4F6; /* Light gray on hover */
    --el-button-active-bg-color: #E5E7EB; /* Even lighter gray on active */
    --el-button-border-color: #FFFFFF; /* White border */
    --el-button-hover-border-color: #F3F4F6;
    --el-button-active-border-color: #E5E7EB;
    --el-button-text-color: #1F2937; /* Dark text color for the button */
    font-weight: 600; /* Bold text for the button */
    padding-top: 0.75rem; /* py-3 */
    padding-bottom: 0.75rem; /* py-3 */
    border-radius: 0.375rem; /* rounded-md */
}
</style>
