import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Make sure environment variables are available in the browser
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
      'import.meta.env.VITE_REACT_APP_API_URL': JSON.stringify(process.env.VITE_REACT_APP_API_URL),
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'https://xnovaapi20251024123055.azurewebsites.net',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
