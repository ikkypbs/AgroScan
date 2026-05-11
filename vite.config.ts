import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // Pakai string kosong supaya path-nya fleksibel di Cloud Run
  build: {
    outDir: 'dist',
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
