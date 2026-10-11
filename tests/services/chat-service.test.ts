import { describe, expect, it } from 'vitest'
import { buildChatPayload, sendChatRequest } from '@/services/chatService'
import type { ChatRequest } from '../../shared/chat'
const request: ChatRequest = { messages: [{ role: 'user', content: '考试让我焦虑，晚上睡不着' }] }
const reply = {
  mode: 'online',
  message: {
    content: '先把今晚的目标缩小到一个步骤。',
    emotion: '焦虑',
    riskLevel: '中',
    keywords: ['考试', '睡眠'],
  },
}
describe('chat service', () => {
  it('returns the normalized online response', async () => {
    const fetcher: typeof fetch = async () => new Response(JSON.stringify(reply), { status: 200 })
    await expect(sendChatRequest(request, fetcher)).resolves.toMatchObject({
      mode: 'online',
      message: { emotion: '焦虑', riskLevel: '中' },
    })
  })
  it('reports an unreachable service so the store can offer fallback and retry', async () => {
    const fetcher: typeof fetch = async () => {
      throw new Error('offline')
    }
    await expect(sendChatRequest(request, fetcher)).rejects.toMatchObject({ kind: 'unavailable' })
  })
  it('bounds UTF-8 request size and history while preserving the latest user message', async () => {
    const history: ChatRequest = {
      messages: Array.from({ length: 80 }, (_, i) => ({
        role: i % 2 ? 'user' : 'assistant',
        content: '中文长对话'.repeat(150) + i,
      })),
      persona: { name: '支持助手', style: '温柔倾听' },
    }
    const payload = buildChatPayload(history)
    expect(payload.messages.length).toBeLessThanOrEqual(30)
    expect(new TextEncoder().encode(JSON.stringify(payload)).byteLength).toBeLessThanOrEqual(
      24 * 1024,
    )
    expect(payload.messages.at(-1)).toEqual(history.messages.at(-1))
    expect(payload.messages[0]?.role).toBe('user')
    expect(history.messages).toHaveLength(80)
    let actualBody = ''
    const fetcher: typeof fetch = async (_url, options) => {
      actualBody = String(options?.body)
      return new Response(JSON.stringify(reply))
    }
    await sendChatRequest(history, fetcher)
    expect(new TextEncoder().encode(actualBody).byteLength).toBeLessThanOrEqual(24 * 1024)
  })
  it('keeps validation errors distinct from service errors', async () => {
    const fetcher: typeof fetch = async () =>
      new Response(JSON.stringify({ error: '请输入有效消息' }), { status: 400 })
    await expect(sendChatRequest(request, fetcher)).rejects.toMatchObject({
      kind: 'input',
      message: '请输入有效消息',
    })
  })
  it.each([401, 403, 404, 429, 500])(
    'treats HTTP %s as unavailable rather than blaming the input',
    async (status) => {
      const fetcher: typeof fetch = async () =>
        new Response(JSON.stringify({ error: 'Service failure' }), { status })
      await expect(sendChatRequest(request, fetcher)).rejects.toMatchObject({ kind: 'unavailable' })
    },
  )
  it('rejects an invalid success payload instead of crashing the chat UI', async () => {
    const fetcher: typeof fetch = async () =>
      new Response(JSON.stringify({ mode: 'online', message: {} }))
    await expect(sendChatRequest(request, fetcher)).rejects.toMatchObject({ kind: 'unavailable' })
  })
  it('recognizes a server-side upstream fallback without changing the response contract', async () => {
    const fetcher: typeof fetch = async () =>
      new Response(JSON.stringify({ ...reply, mode: 'mock' }), {
        headers: { 'X-Chat-Fallback': 'upstream' },
      })
    await expect(sendChatRequest(request, fetcher)).resolves.toMatchObject({
      mode: 'mock',
      unavailable: true,
    })
  })
  it('aborts on timeout and honors explicit cancellation', async () => {
    const fetcher: typeof fetch = (_url, options) =>
      new Promise((_resolve, reject) => {
        options?.signal?.addEventListener(
          'abort',
          () => reject(new DOMException('aborted', 'AbortError')),
          { once: true },
        )
        if (options?.signal?.aborted) reject(new DOMException('aborted', 'AbortError'))
      })
    await expect(sendChatRequest(request, fetcher, { timeoutMs: 10 })).rejects.toMatchObject({
      kind: 'unavailable',
    })
    const controller = new AbortController()
    const promise = sendChatRequest(request, fetcher, { signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toMatchObject({ kind: 'cancelled' })
  })
})
