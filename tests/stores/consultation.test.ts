import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useConsultationStore } from '@/stores/consultation'
import { ChatRequestError, sendChatRequest } from '@/services/chatService'
import type { ChatResponse } from '../../shared/chat'
vi.mock('@/services/chatService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/chatService')>()),
  getChatHealth: vi.fn().mockResolvedValue({ ok: true, configured: true, mode: 'online' }),
  sendChatRequest: vi.fn(),
}))
const reply: ChatResponse = {
  mode: 'online',
  message: { content: '我们一起梳理。', emotion: '压力', riskLevel: '低', keywords: ['工作'] },
}
describe('consultation store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.mocked(sendChatRequest).mockReset().mockResolvedValue(reply)
  })
  afterEach(() => vi.restoreAllMocks())
  it('creates, renames, switches and deletes persistent sessions', () => {
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
    expect(store.sessions[0]?.title).toBe('睡眠支持')
    expect(localStorage.getItem('xinhui-consultation')).toContain('睡眠支持')
  })
  it('restores version-one sessions and per-session drafts', () => {
    const store = useConsultationStore()
    const firstId = store.activeSessionId
    store.renameSession(firstId, '可以找回的对话')
    store.setDraft('第一段草稿')
    store.startNewSession()
    store.setDraft('第二段草稿')
    store.selectSession(firstId)
    setActivePinia(createPinia())
    const restored = useConsultationStore()
    expect(restored.activeSession.title).toBe('可以找回的对话')
    expect(restored.draft).toBe('第一段草稿')
    restored.selectSession(restored.sessions[0]!.id)
    expect(restored.draft).toBe('第二段草稿')
  })
  it('auto-titles the first message and sends the selected persona with a cancellation signal', async () => {
    const store = useConsultationStore()
    store.setDoctor('rational')
    await store.sendMessage('最近的项目进度让我非常焦虑，不知道如何安排')
    expect(store.activeSession.title).toBe('最近的项目进度让我非常焦虑')
    expect(sendChatRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        persona: expect.objectContaining({
          name: '周医生',
          style: expect.stringContaining('理性'),
        }),
      }),
      expect.any(Function),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })
  it('writes a delayed reply to its original session and keeps the original persona', async () => {
    let resolve!: (value: ChatResponse) => void
    vi.mocked(sendChatRequest).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    const store = useConsultationStore()
    const a = store.activeSessionId
    const pending = store.sendMessage('会话A的问题')
    store.startNewSession()
    store.setDoctor('coach')
    const b = store.activeSessionId
    expect(store.isSending).toBe(false)
    resolve(reply)
    await pending
    expect(store.sessions.find((s) => s.id === a)?.messages.at(-1)).toMatchObject({
      content: reply.message.content,
      assistantName: '林医生',
    })
    expect(store.sessions.find((s) => s.id === b)?.messages).toHaveLength(1)
  })
  it('discards late replies for a deleted session', async () => {
    let resolve!: (value: ChatResponse) => void
    vi.mocked(sendChatRequest).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    const store = useConsultationStore()
    const id = store.activeSessionId
    const pending = store.sendMessage('会被删除的对话')
    store.deleteSession(id)
    resolve(reply)
    await pending
    expect(store.sessions.some((s) => s.id === id)).toBe(false)
    expect(store.messages).toHaveLength(1)
    expect(store.isSending).toBe(false)
  })
  it('keeps concurrent sending states and captures context before an active-session change', async () => {
    const pendingReplies: Array<(value: ChatResponse) => void> = []
    vi.mocked(sendChatRequest).mockImplementation(
      () => new Promise((resolve) => pendingReplies.push(resolve)),
    )
    const store = useConsultationStore()
    const a = store.activeSessionId
    store.setContext({ region: '广东', population: '大学生', emotionType: '焦虑' })
    const first = store.sendMessage('会话A的消息')
    store.setDoctor('rational')
    store.setContext({ region: '湖北' })
    expect(sendChatRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        persona: expect.objectContaining({ name: '林医生' }),
        context: { region: '广东', population: '大学生', emotionType: '焦虑' },
        messages: expect.arrayContaining([{ role: 'user', content: '会话A的消息' }]),
      }),
      expect.any(Function),
      expect.any(Object),
    )
    store.startNewSession()
    const b = store.activeSessionId
    const second = store.sendMessage('会话B的消息')
    expect(store.isSending).toBe(true)
    store.selectSession(a)
    expect(store.isSending).toBe(true)
    pendingReplies[0]!(reply)
    await first
    expect(store.isSending).toBe(false)
    expect(store.messages.at(-1)?.assistantName).toBe('林医生')
    store.selectSession(b)
    expect(store.isSending).toBe(true)
    pendingReplies[1]!(reply)
    await second
    expect(store.isSending).toBe(false)
    expect(store.messages.at(-1)?.assistantName).toBe('周医生')
  })
  it('continues in memory when saving throws and always releases sending state', async () => {
    const store = useConsultationStore()
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    await store.sendMessage('存储失败也能继续')
    expect(store.isSending).toBe(false)
    expect(store.messages.at(-1)?.content).toBe(reply.message.content)
    expect(store.storageWarning).toContain('无法保存')
  })
  it('provides a fallback on service failure and retries without duplicating the user message', async () => {
    vi.mocked(sendChatRequest).mockRejectedValueOnce(
      new ChatRequestError('unavailable', '连接暂时中断'),
    )
    const store = useConsultationStore()
    await store.sendMessage('考试让我焦虑')
    const user = store.messages.find((m) => m.role === 'user')!
    expect(store.activeRequest.retryMessageId).toBe(user.id)
    expect(store.messages.at(-1)?.sourceMode).toBe('mock')
    await store.retryMessage()
    expect(store.messages.filter((m) => m.role === 'user')).toHaveLength(1)
    expect(store.messages.at(-1)?.content).toBe(reply.message.content)
    expect(store.activeRequest.error).toBe('')
  })
  it('cancels an in-flight reply and leaves the same user message retryable', async () => {
    let resolve!: (value: ChatResponse) => void
    vi.mocked(sendChatRequest).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    const store = useConsultationStore()
    const pending = store.sendMessage('等待中的问题')
    store.cancelRequest()
    resolve(reply)
    await pending
    expect(store.messages).toHaveLength(2)
    expect(store.isSending).toBe(false)
    expect(store.activeRequest.status).toBe('cancelled')
    await store.retryMessage()
    expect(store.messages.filter((m) => m.role === 'user')).toHaveLength(1)
    expect(store.messages.at(-1)?.content).toBe(reply.message.content)
  })
  it('keeps invalid input distinct from a generated fallback response', async () => {
    vi.mocked(sendChatRequest).mockRejectedValueOnce(new ChatRequestError('input', '请检查消息'))
    const store = useConsultationStore()
    await store.sendMessage('需要检查的输入')
    expect(store.messages).toHaveLength(2)
    expect(store.activeRequest.error).toBe('请检查消息')
    expect(store.isSending).toBe(false)
  })
})
