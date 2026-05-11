import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // Kosongkan total, jangan pakai '/' atau './'
  build: {
    outDir: 'dist',
    assetsDir: '', // Kosongkan biar gak ada folder /assets/
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
