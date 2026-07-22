import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@app\/shared$/,
        replacement: fileURLToPath(new URL('../Shared/src/index.ts', import.meta.url)),
      },
      {
        find: /^@app\/shared\/(.*)$/,
        replacement: `${fileURLToPath(new URL('../Shared/src', import.meta.url))}/$1`,
      },
    ],
  },
  server: {
    port: 5173,
  },
});
