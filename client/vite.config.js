import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { extractPortFromUrl } from './src/helpers';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), '..'), '');

  const frontendPort = extractPortFromUrl(env['FRONTEND_DEV_HOST']);
  if (!frontendPort) throw new Error('"frontendPort" wasn\'t extracted. It wasn\'t found in received url');

  return {
    plugins: [react()],
    define: {
      'global': 'globalThis',
      'process.env': env,
    },
    server: {
      hmr: {
        host: 'localhost',
        port: frontendPort,
      },
      port: frontendPort,
      proxy: {
        '/api': {
          target: `${env['BACKEND_API']}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
