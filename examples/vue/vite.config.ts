import Vue from '@vitejs/plugin-vue'
import Routes from 'unplugin-fs-router/vite'
import { defineConfig } from 'vite'
// import Inspect from 'vite-plugin-inspect'
// import Markdown from 'vite-plugin-vue-markdown'

const config = defineConfig({
  plugins: [
    Routes(),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    
    // Markdown(),
    // Inspect(),
  ],
})

export default config
