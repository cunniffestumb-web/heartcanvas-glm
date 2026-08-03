import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useConsultationStore } from '@/stores/consultation'
import { sendChatRequest } from '@/services/chatService'

vi.mock('@/services/chatService', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/services/chatService')>()
  return {
    ...original,
    getChatHealth: vi.fn().mockResolvedValue({ ok: true, configured: true, mode: 'online' }),
    sendChatRequest: vi.fn().mockResolvedValue({
      mode: 'online',
      message: { content: '我们一起梳理。', emotion: '压力', riskLevel: '低', keywords: ['工作'] },
    }),
  }
})

describe('consultation store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('creates, renames, switches, and deletes persistent sessions', () => {
    const store = useConsultationStore()
    const firstId = store.activeSessionId

    store.startNewSession()
    const secondId = store.activeSessionId
    store.renameSession(secondId, '睡眠支持')
    store.selectSession(firstId)
    store.deleteSession(firstId)

    expect(secondId).not.toBe(firstId)
    expect(store.sessions).toHaveLength(1)
    expect(store.activeSessionId).toBe(secondId)
    expect(store.sessions[0].title).toBe('睡眠支持')
    expect(localStorage.getItem('xinhui-consultation')).toContain('睡眠支持')
  })

  it('restores sessions after the store is recreated', () => {
    const firstStore = useConsultationStore()
    firstStore.renameSession(firstStore.activeSessionId, '可以找回的对话')

    setActivePinia(createPinia())
    const restoredStore = useConsultationStore()

    expect(restoredStore.sessions[0].title).toBe('可以找回的对话')
  })

  it('auto-titles the first user message and sends the selected doctor persona', async () => {
    const store = useConsultationStore()
    store.setDoctor('rational')

    await store.sendMessage('最近的项目进度让我非常焦虑，不知道如何安排')

    expect(store.activeSession.title).toBe('最近的项目进度让我非常焦虑')
    expect(sendChatRequest).toHaveBeenCalledWith(expect.objectContaining({
      persona: expect.objectContaining({ name: '周医生', style: expect.stringContaining('理性') }),
    }))
  })
})
