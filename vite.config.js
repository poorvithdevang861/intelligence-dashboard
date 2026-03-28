import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  /**
   * Dev: `/` for localhost. Prod: `./` so JS/CSS/JSON resolve relative to the page URL.
   * GitHub repo URLs can be `…/Intelligence-dashboard/` (capital I) while absolute `/intelligence-dashboard/` breaks.
   */
  base: mode === 'production' ? './' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
}))
