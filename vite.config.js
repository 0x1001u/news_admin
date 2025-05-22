import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    // Optional: Configure server for proxying API requests during development
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8000', // Your backend API address
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, '/api'),
    //         },
    //     },
    // },
});

