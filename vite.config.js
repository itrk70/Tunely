import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is relative so the built app works when deployed to GitHub Pages
// under a repo subpath (e.g. username.github.io/tunely/).
export default defineConfig({
  plugins: [react()],
  base: '/Tunely/',
})
