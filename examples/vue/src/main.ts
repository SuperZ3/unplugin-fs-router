
import { createRouter, createWebHistory } from 'vue-router'

import routes from 'unplugin-fs-router/routes'

import App from './App.vue'
import './index.css'
import { createApp } from 'vue'

// eslint-disable-next-line no-console
console.log('vue:', routes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')
