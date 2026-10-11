// @vitest-environment node

import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApiApp, type SupportProvider } from '../../server/app'

describe('chat api', () => {
  it('reports configuration state without exposing secrets', async () => {
    const response = await request(createApiApp({ provider: null })).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true, configured: false, mode: 'mock' })
    expect(JSON.stringify(response.body)).not.toContain('token')
  })

  it('uses a structured mock response when no provider is configured', async () => {
    const response = await request(createApiApp({ provider: null }))
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: '最近考试让我很焦虑' }] })

    expect(response.status).toBe(200)
    expect(response.body.mode).toBe('mock')
    expect(response.body.message).toMatchObject({ emotion: '焦虑', riskLevel: '中' })
  })

  it('returns crisis guidance without calling the configured provider', async () => {
    let providerCalls = 0
    const provider: SupportProvider = {
      async reply() {
        providerCalls += 1
        throw new Error('provider should not be called')
      },
    }

    const response = await request(createApiApp({ provider }))
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: '我想伤害自己' }] })

    expect(response.status).toBe(200)
    expect(response.body.message.riskLevel).toBe('高')
    expect(providerCalls).toBe(0)
  })

  it('returns an online response from a configured provider', async () => {
    const provider: SupportProvider = {
      async reply() {
        return {
          content: '我听见了你的压力。我们先从一个小步骤开始。',
          emotion: '压力',
          riskLevel: '中',
          keywords: ['工作', '睡眠'],
        }
      },
    }

    const response = await request(createApiApp({ provider }))
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: '工作压力很大' }] })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      mode: 'online',
      message: {
        content: '我听见了你的压力。我们先从一个小步骤开始。',
        emotion: '压力',
        riskLevel: '中',
        keywords: ['工作', '睡眠'],
      },
    })
  })

  it('falls back to mock when the provider fails', async () => {
    const provider: SupportProvider = {
      async reply() {
        throw new Error('upstream unavailable')
      },
    }

    const response = await request(createApiApp({ provider }))
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: '我最近睡不好' }] })

    expect(response.status).toBe(200)
    expect(response.body.mode).toBe('mock')
    expect(response.body.message.emotion).toBe('睡眠困扰')
    expect(response.headers['x-chat-fallback']).toBe('upstream')
  })

  it('rejects empty or oversized messages', async () => {
    const app = createApiApp({ provider: null })
    const empty = await request(app).post('/api/chat').send({ messages: [] })
    const oversized = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: '压'.repeat(4001) }],
      })

    expect(empty.status).toBe(400)
    expect(oversized.status).toBe(400)
  })
})
