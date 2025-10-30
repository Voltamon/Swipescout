import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-icons', '@mui/material', '@mui/icons-material', '@mui/lab'],
          firebase: ['@firebase/auth'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          forms: ['formik', 'react-hook-form', 'yup'],
          utils: ['axios', 'socket.io-client', 'date-fns', 'dayjs', 'uuid'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
    // Dev server middleware to set Cross-Origin-Opener-Policy so popups can close and postMessage
    // This mirrors the backend header used in production and avoids COOP blocking during dev.
    middlewareMode: false,
    setup: ({ middlewares }) => {
      // Vite's connect-style middleware stack: add a header for all responses
      middlewares.use((req, res, next) => {
        try {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
          res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
        } catch {
          // ignore if headers already sent
        }
        next();
      });
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
});
