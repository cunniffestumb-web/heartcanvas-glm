import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('@/pages/GalleryPage.vue') },
  { path: '/database', name: 'database', component: () => import('@/pages/DatabasePage.vue') },
  { path: '/consultation', name: 'consultation', component: () => import('@/pages/ConsultationPage.vue') },
  { path: '/technology', name: 'technology', component: () => import('@/pages/TechnologyPage.vue') },
  { path: '/scenarios', name: 'scenarios', component: () => import('@/pages/ScenariosPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
