/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  server: {
    proxy: {
      '/api/ynab': {
        target: 'https://api.ynab.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ynab/, ''),
        secure: true,
      },
    },
  },
})
