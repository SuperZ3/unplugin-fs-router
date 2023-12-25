import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import routes from '../src'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), routes()],
})
