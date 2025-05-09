import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['react-linkedin-login-oauth2']
//   },
// })

export default defineConfig({
  build: {
    sourcemap: true, // or 'hidden' if you don't need sourcemaps
  },
  plugins: [react()],
})