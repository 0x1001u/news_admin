import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 不再需要 path 模块，因为我们将使用相对路径
// import path from 'path';

export default defineConfig({
    // 显式设置项目根目录为当前目录
    // 这告诉 Vite 在哪里寻找 'public' 和 'src' 文件夹
    root: '.',
    plugins: [vue()],
    build: {
        // 显式定义 Rollup 的入口文件。
        // 对于单页应用，通常 'public/index.html' 是入口。
        // 使用相对于 'root' 的路径，这里是 '.'
        rollupOptions: {
            input: 'public/index.html', // 直接指定相对路径
        },
        // 设置构建输出目录
        outDir: 'dist',
    },
    // 可选：配置开发服务器的 API 代理
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8000', // 您的后端 API 地址
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, '/api'),
    //         },
    //     },
    // },
});

