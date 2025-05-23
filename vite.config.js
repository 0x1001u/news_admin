import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    // 显式设置项目根目录为当前目录
    // 这告诉 Vite 在哪里寻找 'public' 和 'src' 文件夹
    root: '.',
    plugins: [vue()],
    // 显式设置公共基础路径。
    // 对于 Cloudflare Pages，如果您的项目部署在 pages.dev 域名的根路径下
    // (例如，https://your-project.your-username.pages.dev/)，那么 '/' 是正确的。
    // 如果它部署在子路径下 (例如，https://your-domain.com/my-app/)，
    // 那么它应该是 '/my-app/'。根据您“根目录”为空的设置，'/' 可能是正确的。
    base: '/',
    build: {
        // 显式定义 Rollup 的入口文件。
        // 对于单页应用，通常 'public/index.html' 是入口。
        // 使用相对于 'root' 的路径，这里是 '.'
        rollupOptions: {
            input: 'public/index.html',
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

