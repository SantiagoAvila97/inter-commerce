import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

function spaFallback404(): import('vite').Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const indexPath = path.resolve(__dirname, 'dist/index.html');
      const fallbackPath = path.resolve(__dirname, 'dist/404.html');

      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, fallbackPath);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback404()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
