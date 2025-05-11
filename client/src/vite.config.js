import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Configure the API proxy correctly
      '/api': {
        target: 'http://localhost:8000', // Adjust to your backend server URL
        changeOrigin: true,
        secure: false,
        // For development, optionally configure a fallback when API is not available
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        }
      }
    }
  }
});
