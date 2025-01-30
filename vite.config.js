import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.222:3001',
        changeOrigin: true,
      },
    },
    host: '0.0.0.0'
  },
})