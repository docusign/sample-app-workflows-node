import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), '..'), ''); // env file

  return {
    plugins: [react()],
    define: {
      'global': 'globalThis',
      'process.env': env,
    },
    server: {
      hmr: {
        host: '127.0.0.1',
        port: env['FRONTEND_PORT'],
      },
      port: env['FRONTEND_PORT'],
    },
  };
});
