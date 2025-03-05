import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import routes from 'unplugin-fs-router/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [routes(), react()],
})
