import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Suporte universal a GitHub Pages, Vercel e Capacitor
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
