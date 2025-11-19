import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// With custom domain: base = '/'
// Without custom domain (default GitHub Pages): base = '/nom-du-repo/'
// For local development: base = '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.CUSTOM_DOMAIN === 'true' || process.env.GITHUB_PAGES !== 'true'
    ? '/'
    : `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'transaction-flow-calculator'}/`,
  define: {
    // Expose NODE_ENV to client code via VITE_NODE_ENV
    'import.meta.env.VITE_NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
