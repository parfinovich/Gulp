import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html')
      }
    },
    cssMinify: 'lightningcss',
    minify: 'terser'
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    },
    lightningcss: {
      targets: {
        chrome: 80
      }
    }
  },
  optimizeDeps: {
    include: ['swiper']
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3001
  }
});
