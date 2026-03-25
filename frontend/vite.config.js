import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isWidget = process.env.BUILD_TARGET === 'widget';

export default defineConfig({
  plugins: [react()],

  build: isWidget
    ? {
        // ── Modo widget: genera un único IIFE embebible ──
        lib: {
          entry: 'src/main.jsx',
          name: 'ZoologicChatbot',
          fileName: 'chatbot',
          formats: ['iife'],
        },
        rollupOptions: { external: [] },
        chunkSizeWarningLimit: 600,
      }
    : {
        // ── Modo app: build estático para Vercel ──
        outDir: 'dist',
        sourcemap: false,
      },

  server: {
    port: 5173,
    proxy: {
      // En dev: /api/chat → http://localhost:3001/chat
      '/api': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
