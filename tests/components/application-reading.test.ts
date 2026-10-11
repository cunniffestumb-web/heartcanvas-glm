import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type DOMWrapper, type VueWrapper } from '@vue/test-utils'
import { createPinia, disposePinia, type Pinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import App from '@/App.vue'
import { routes } from '@/router'
import { useConsultationStore } from '@/stores/consultation'
import { cases } from '@/data/cases'

// Installation is verified in the browser; avoid transforming its public SVG in the test runner.
vi.mock('@/components/common/AppInstallDialog.vue', () => ({ default: { template: '<div />' } }))

vi.mock('@/services/chatService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/chatService')>()),
  getChatHealth: vi.fn().mockResolvedValue({ ok: true, configured: false, mode: 'mock' }),
}))

const mounted: { wrapper: VueWrapper; pinia: Pinia }[] = []
async function followLink(link: DOMWrapper<Element>, router: Router) {
  const navigation = vi.spyOn(router, 'push')
  await link.trigger('click')
  await navigation.mock.results.at(-1)!.value
  navigation.mockRestore()
  await flushPromises()
}
async function open(path: string) {
  const pinia = createPinia()
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [pinia, router] } })
  mounted.push({ wrapper, pinia })
  await flushPromises()
  return { wrapper, router, pinia }
}

describe('reading inside the user application', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => mounted.splice(0).forEach(({ wrapper, pinia }) => {
    wrapper.unmount()
    disposePinia(pinia)
  }))

  it('keeps the application shell when opening the homepage reading action and its cards', async () => {
    const { wrapper, router } = await open('/app')
    await followLink(wrapper.get('.quick-actions a[href="/app/library"]'), router)

    expect(router.currentRoute.value.path).toBe('/app/library')
    expect(wrapper.find('.application').exists()).toBe(true)
    expect(wrapper.find('.site-header').exists()).toBe(false)
    expect(wrapper.get('.app-breadcrumb strong').text()).toBe('阅读')
    expect(wrapper.findAll('.application-tabbar a')).toHaveLength(4)
    expect(wrapper.get('.application-tabbar a.selected').attributes('href')).toBe('/app')
    expect(wrapper.get('.library-back-link').attributes('href')).toBe('/app')
    expect(wrapper.findAll('[data-case-card]')).toHaveLength(cases.length)
    expect(wrapper.findAll('[data-case-card] a').every(link =>
      link.attributes('href').startsWith('/app/library/'),
    )).toBe(true)
  })

  it('keeps recommendations and the return path inside the application, including a missing case', async () => {
    const { wrapper, router } = await open('/app/library/test-anxiety-adolescent')
    expect(wrapper.get('.back-link').attributes('href')).toBe('/app/library')
    expect(wrapper.get('.app-breadcrumb strong').text()).toBe('案例阅读')
    expect(wrapper.findAll('.related-grid a').every(link =>
      link.attributes('href').startsWith('/app/library/'),
    )).toBe(true)
    await followLink(wrapper.get('.related-grid a'), router)
    expect(router.currentRoute.value.path).toMatch(/^\/app\/library\//u)
    expect(wrapper.find('.application').exists()).toBe(true)

    await router.push('/app/library/not-found')
    await flushPromises()
    expect(wrapper.get('.not-found a').attributes('href')).toBe('/app/library')
    await followLink(wrapper.get('.not-found a'), router)
    expect(router.currentRoute.value.path).toBe('/app/library')
    expect(wrapper.find('.application').exists()).toBe(true)
  })

  it('opens the support draft from a case without leaving the application or sending it', async () => {
    const { wrapper, router, pinia } = await open('/app/library/test-anxiety-adolescent')
    await followLink(wrapper.get('.case-support a'), router)
    const consultation = useConsultationStore(pinia)

    expect(router.currentRoute.value.path).toBe('/app/chat')
    expect(router.currentRoute.value.query.case).toBeUndefined()
    expect(wrapper.find('.application').exists()).toBe(true)
    expect(consultation.draft).toContain(cases.find(item => item.slug === 'test-anxiety-adolescent')!.title)
    expect(consultation.hasUserMessages).toBe(false)
  })

  it('retains the website layout and case URLs for the official case center', async () => {
    const { wrapper, router } = await open('/cases')
    expect(wrapper.find('.site-header').exists()).toBe(true)
    expect(wrapper.find('.application').exists()).toBe(false)
    await followLink(wrapper.get('[data-case-card] h2 a'), router)

    expect(router.currentRoute.value.path).toMatch(/^\/cases\//u)
    expect(wrapper.get('.back-link').attributes('href')).toBe('/cases')
    expect(wrapper.findAll('.related-grid a').every(link =>
      link.attributes('href').startsWith('/cases/'),
    )).toBe(true)
    expect(wrapper.find('.site-header').exists()).toBe(true)
  })
})
