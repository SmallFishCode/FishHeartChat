import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
      }
    }
  }
})
