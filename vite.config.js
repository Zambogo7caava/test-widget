import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://caava.192.0.0.123.nip.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/akili/proj_9367b4b0/web'),
      },
    },
  },
})

