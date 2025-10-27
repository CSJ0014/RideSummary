import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // When running `vercel dev`, this forwards API calls to Vercel serverless on 3000.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
