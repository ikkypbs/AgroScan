import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: '', // Kosongkan ini biar file CSS/JS nggak masuk folder assets
    sourcemap: false
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
