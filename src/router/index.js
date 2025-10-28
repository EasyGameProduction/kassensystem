import { createRouter, createWebHistory } from 'vue-router'
import KassensystemMain from '../views/KassensystemMain.vue'
import DesktopAuswahl from '../views/DesktopAuswahl.vue'
import KassenprojektAuswahl from '@/views/KassenprojektAuswahl.vue'

const routes = [
  {
    path: '/',
    name: 'kassenprojektAuswahl',
    component: KassenprojektAuswahl
  },
  {
    path: '/desktop',
    name: 'desktopAuswahl',
    component: DesktopAuswahl
  },
  {
    path: '/kasse',
    name: 'main',
    component: KassensystemMain
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
