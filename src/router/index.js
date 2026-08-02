import { createRouter, createWebHistory } from 'vue-router'
import KassensystemMain from '../views/KassensystemMain.vue'
import DesktopAuswahl from '../views/DesktopAuswahl.vue'
import KassenprojektAuswahl from '@/views/KassenprojektAuswahl.vue'
import LoginScreen from '@/views/LoginScreen.vue'
import Datenschutz from '@/views/Datenschutz.vue'

const routes = [
  {
    path: '/',
    name: 'kassenprojekte',
    component: KassenprojektAuswahl
  },
  {
    path: '/kassenprojekte/:kassenprojektID/desktops',
    name: 'desktops',
    component: DesktopAuswahl
  },
  {
    path: '/kassenprojekte/:kassenprojektID/desktops/:desktopID',
    name: 'main',
    component: KassensystemMain
  },
  {
    path: '/login',
    name: 'login',
    component: LoginScreen
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: Datenschutz
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
