import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })

export default defineConfig({
  build: {
    sourcemap: true, // or 'hidden' if you don't need sourcemaps
  },
  plugins: [react()],
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'), // Define the '@' alias
    },
  },
})