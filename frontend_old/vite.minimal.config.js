import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    strictPort: true,
    hmr: {
      clientPort: 3001
    }
  },
  logLevel: 'info'
})