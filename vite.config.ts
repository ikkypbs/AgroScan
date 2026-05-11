import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Hapus base: './' atau base: '/' biar pakai default
  build: {
    outDir: 'dist',
    assetsDir: '.', // Ini kuncinya! Biar file JS/CSS gak masuk folder assets, tapi sejajar sama index.html
    emptyOutDir: true
  },
  server: {
    port: 8080,
    host: true
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true
  }
})
