/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes as autoRoutes } from 'vue-router/auto-routes'

// Import your components
import Apropos from '@/pages/Apropos.vue'
import Carte from '@/pages/Carte.vue'
import Mentions from '@/pages/Mentions.vue'

// Define additional routes
const additionalRoutes = [
  {
    path: '/carte',
    component: Carte,
  },
  {
    path: '/apropos',
    component: Apropos,
  },
  {
    path: '/mentions-legales',
    component: Mentions,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts([...autoRoutes, ...additionalRoutes]),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
