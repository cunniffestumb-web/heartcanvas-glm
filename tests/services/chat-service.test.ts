import { describe, expect, it } from 'vitest'
import { sendChatRequest } from '@/services/chatService'

const request = {
  messages: [{ role: 'user' as const, content: '考试让我焦虑，晚上睡不着' }],
}

describe('chat service', () => {
  it('returns the normalized online response from the API', async () => {
    const fetcher: typeof fetch = async () => new Response(JSON.stringify({
      mode: 'online',
      message: {
        content: '先把今晚的目标缩小到一个步骤。',
        emotion: '焦虑',
        riskLevel: '中',
        keywords: ['考试', '睡眠'],
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })

    await expect(sendChatRequest(request, fetcher)).resolves.toMatchObject({
      mode: 'online',
      message: { emotion: '焦虑', riskLevel: '中' },
    })
  })

  it('keeps the experience usable when the API is unreachable', async () => {
    const fetcher: typeof fetch = async () => { throw new Error('offline') }
    const response = await sendChatRequest(request, fetcher)

    expect(response.mode).toBe('mock')
    expect(response.message.emotion).toBe('焦虑')
    expect(response.message.keywords).toEqual(expect.arrayContaining(['考试', '睡眠']))
    expect(response.message.content).toContain('专业心理咨询')
  })
})
