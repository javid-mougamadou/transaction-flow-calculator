import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Pour GitHub Pages: base = '/nom-du-repo/'
// Pour production locale: base = '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' 
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'transaction-flow-calculator'}/`
    : '/',
});
