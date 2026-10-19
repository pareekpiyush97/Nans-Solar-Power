import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => relative asset paths so it works on GitHub Pages project subpaths.
// Routing uses HashRouter, so no server-side SPA fallback is needed.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', sourcemap: false },
})
