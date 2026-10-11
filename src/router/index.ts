import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('@/pages/GalleryPage.vue') },
  { path: '/database', name: 'database', component: () => import('@/pages/DatabasePage.vue') },
  { path: '/cases', name: 'cases', component: () => import('@/pages/CaseListPage.vue') },
  {
    path: '/cases/:slug',
    name: 'case-detail',
    component: () => import('@/pages/CaseDetailPage.vue'),
  },
  {
    path: '/consultation',
    name: 'consultation',
    redirect: (to) => ({ path: '/app/chat', query: to.query, hash: to.hash }),
  },
  {
    path: '/technology',
    name: 'technology',
    component: () => import('@/pages/TechnologyPage.vue'),
  },
  { path: '/scenarios', name: 'scenarios', component: () => import('@/pages/ScenariosPage.vue') },
  { path: '/app', name: 'app-today', component: () => import('@/pages/application/TodayPage.vue'), meta: { application: true, title: '今天' } },
  { path: '/app/chat', name: 'app-chat', component: () => import('@/pages/ConsultationPage.vue'), meta: { application: true, title: '陪伴' } },
  { path: '/app/mood', name: 'app-mood', component: () => import('@/pages/application/MoodPage.vue'), meta: { application: true, title: '心情' } },
  { path: '/app/me', name: 'app-me', component: () => import('@/pages/application/MePage.vue'), meta: { application: true, title: '我的' } },
  {
    path: '/app/library',
    name: 'app-library',
    component: () => import('@/pages/CaseListPage.vue'),
    props: { application: true },
    meta: { application: true, title: '阅读', section: '/app' },
  },
  {
    path: '/app/library/:slug',
    name: 'app-library-detail',
    component: () => import('@/pages/CaseDetailPage.vue'),
    props: { application: true },
    meta: { application: true, title: '案例阅读', section: '/app' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, _from, savedPosition) =>
    savedPosition || (to.hash ? { el: to.hash, top: 92 } : { top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.application ? `${String(to.meta.title)} · 心绘` : '心绘 GLM · 心理数据与智能支持'
})

export default router
