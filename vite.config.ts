import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { promises as fs } from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const copyTestApiHtml = () => {
  return {
    name: 'copy-test-api-html',
    async writeBundle() {
      try {
        const source = path.resolve(__dirname, 'test-api.html');
        const destination = path.resolve(__dirname, 'dist', 'test-api.html');

        await fs.copyFile(source, destination);
        console.log('test-api.html has been copied to the dist folder.');
      } catch (error) {
        console.error('Failed to copy test-api.html:', error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copyTestApiHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
