import { createRouter, createWebHistory } from 'vue-router'
import type {Router} from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import('../views/NotFoundView.vue')
    },
  ]
})

export default router
