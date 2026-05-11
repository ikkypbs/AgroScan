import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Wajib pakai titik
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
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
