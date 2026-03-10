import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy Socket.IO requests to the API server
      '/socket.io': {
        target: process.env['VITE_API_URL'] ?? 'http://localhost:3000',
        ws: true,
      },
    },
  },
});
