import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import ConsultationPage from '@/pages/ConsultationPage.vue'
import { useConsultationStore } from '@/stores/consultation'
import { getSupportTopic } from '@/data/supportTopics'
import { cases } from '@/data/cases'
import { sendChatRequest } from '@/services/chatService'

vi.mock('@/services/chatService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/chatService')>()),
  getChatHealth: vi.fn().mockResolvedValue({ ok: true, configured: false, mode: 'mock' }),
  sendChatRequest: vi.fn(),
}))
const mounted: VueWrapper[] = []
async function open(path: string) {
  const pinia = createPinia()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/consultation', component: ConsultationPage }],
  })
  await router.push(path)
  const wrapper = mount(ConsultationPage, {
    global: {
      plugins: [pinia, router],
      stubs: { ChatWindow: true, SessionSidebar: true },
    },
  })
  mounted.push(wrapper)
  await flushPromises()
  return { wrapper, router, store: useConsultationStore(pinia) }
}
describe('consultation entry links', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  })

  it('consumes a topic once, retains derived emotion with a region and restores its editable draft', async () => {
    const first = await open('/consultation?topic=exam&region=广东')
    expect(first.router.currentRoute.value.query).toEqual({ region: '广东' })
    expect(first.store.sessions).toHaveLength(2)
    expect(first.store.context).toMatchObject({
      region: '广东',
      emotionType: getSupportTopic('exam')!.emotion,
    })
    expect(first.wrapper.get('textarea').element.value).toBe(getSupportTopic('exam')!.draft)
    expect(first.store.hasUserMessages).toBe(false)
    first.wrapper.unmount()
    const restored = await open(first.router.currentRoute.value.fullPath)
    expect(restored.store.sessions).toHaveLength(2)
    expect(restored.store.draft).toBe(getSupportTopic('exam')!.draft)
    expect(sendChatRequest).not.toHaveBeenCalled()
  })

  it.each([cases[0]!.slug, cases[0]!.id])(
    'opens case %s with preserved filter context and no automatic send',
    async (id) => {
      const { store, router } = await open(
        `/consultation?case=${id}&population=大学生&emotion=焦虑`,
      )
      expect(store.sessions).toHaveLength(2)
      expect(store.draft).toContain(cases[0]!.title)
      expect(store.context).toMatchObject({ population: '大学生', emotionType: '焦虑' })
      expect(router.currentRoute.value.query).toEqual({ population: '大学生', emotion: '焦虑' })
      expect(store.hasUserMessages).toBe(false)
      expect(sendChatRequest).not.toHaveBeenCalled()
    },
  )

  it('removes unknown prefill parameters without creating extra sessions', async () => {
    const { store, router } = await open('/consultation?topic=unknown&case=unknown')
    expect(store.sessions).toHaveLength(1)
    expect(store.draft).toBe('')
    expect(router.currentRoute.value.query).toEqual({})
  })
})
