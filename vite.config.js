import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: { // Add this new server configuration
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /\/dashboard/, to: '/index.html' }
      ]
    }
  }
})