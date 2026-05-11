import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Pakai titik-garis miring
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 8080,
    host: true,
    allowedHosts: true
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true
  }
})
