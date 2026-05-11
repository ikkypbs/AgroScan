import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Tambahkan ini biar jalurnya relatif dan nggak putih polos
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
