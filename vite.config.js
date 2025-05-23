import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Import path module

export default defineConfig({
    // Explicitly set the project root. This tells Vite where to look for 'public' and 'src'.
    // Since package.json and vite.config.js are at the repo root, and public/ is directly under it,
    // the root is the current working directory, represented by process.cwd() or simply '.'
    root: '.',
    plugins: [vue()],
    build: {
        // Explicitly define the entry point for Rollup (Vite's underlying bundler).
        // This ensures Vite knows exactly which HTML file is the main entry.
        rollupOptions: {
            input: path.resolve(__dirname, 'public/index.html'),
        },
        // Set the output directory for the build artifacts
        outDir: 'dist',
    },
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

