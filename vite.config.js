import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 导入 Node.js 的 path 模块

export default defineConfig({
    // 显式设置项目根目录为当前工作目录。
    // 这告诉 Vite 在哪里寻找 'public' 和 'src' 文件夹。
    root: process.cwd(),
    plugins: [vue()],
    // 配置路径别名
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), 'src')
        }
    },
    // 显式设置公共基础路径。
    // 对于部署在域名根目录的 SPA 应用（如 Cloudflare Pages），通常设置为 '/'。
    base: '/',
    build: {
        // 显式定义 Rollup（Vite 内部使用的打包工具）的入口文件。
        // 这告诉 Vite 哪个 HTML 文件是应用的主入口。
        // 现在 index.html 位于项目根目录，所以直接引用它。
        rollupOptions: {
            input: path.resolve(process.cwd(), 'index.html'),
        },
        // 设置构建输出目录。'dist' 是 Vite 的默认输出目录。
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
