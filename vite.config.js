import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 导入 Node.js 的 path 模块

export default defineConfig({
    // 显式设置项目根目录为当前工作目录。
    // 这告诉 Vite 在哪里寻找 'public' 和 'src' 文件夹。
    // process.cwd() 返回 Node.js 进程的当前工作目录，
    // 确保 Vite 从执行 'npm run build' 的目录开始查找。
    root: process.cwd(),
    plugins: [vue()],
    // 显式设置公共基础路径。
    // 对于部署在域名根目录的 SPA 应用（如 Cloudflare Pages），通常设置为 '/'。
    base: '/',
    build: {
        // 显式定义 Rollup（Vite 内部使用的打包工具）的入口文件。
        // 这告诉 Vite 哪个 HTML 文件是应用的主入口。
        // path.resolve() 会将路径片段解析为绝对路径。
        // 在这里，它会从当前工作目录解析到 'public/index.html'。
        rollupOptions: {
            input: path.resolve(process.cwd(), 'public/index.html'),
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

