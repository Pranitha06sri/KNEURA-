import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
  server: {
    proxy: {
      '/api': process.env.KNEURA_API_TARGET || 'http://127.0.0.1:8000',
    },
  },
=======
  server: { proxy: { '/api': process.env.KNEURA_API_PROXY || 'http://127.0.0.1:8000' } },
  preview: { proxy: { '/api': process.env.KNEURA_API_PROXY || 'http://127.0.0.1:8000' } },
>>>>>>> Stashed changes
})
