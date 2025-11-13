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
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
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
      // Proxy Cloudinary videos to avoid CORS issues
      '/cloudinary-proxy': {
        target: 'https://res.cloudinary.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudinary-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Add CORP header for proxied videos
            proxyRes.headers['cross-origin-resource-policy'] = 'cross-origin';
          });
        },
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless', // More permissive than require-corp
    },
    // Dev server middleware to set proper headers for FFmpeg SharedArrayBuffer
    middlewareMode: false,
    setup: ({ middlewares }) => {
      // Vite's connect-style middleware stack: add headers for all responses
      middlewares.use((req, res, next) => {
        try {
          // FFmpeg requires these headers for SharedArrayBuffer support
          // Using 'credentialless' allows loading external resources without CORP headers
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
          
          // Ensure worker files have correct MIME type
          if (req.url && (req.url.includes('worker') || req.url.includes('.wasm'))) {
            if (req.url.includes('.wasm')) {
              res.setHeader('Content-Type', 'application/wasm');
            } else if (req.url.includes('.js')) {
              res.setHeader('Content-Type', 'application/javascript');
            }
          }
        } catch {
          // ignore if headers already sent
        }
        next();
      });
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
});
