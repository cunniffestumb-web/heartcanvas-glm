import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleWorkerRequest, type WorkerEnv } from '../../worker/index'

function createEnv(assetResponse = new Response('app shell')): WorkerEnv {
  return {
    ASSETS: { fetch: vi.fn().mockResolvedValue(assetResponse) },
    ANTHROPIC_BASE_URL: 'https://api.deepseek.com/anthropic',
    ANTHROPIC_MODEL: 'deepseek-v4-pro',
  }
}

describe('sites worker', () => {
  afterEach(() => vi.restoreAllMocks())
  it('reports whether the hosted provider is configured without exposing secrets', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/api/health'),
      createEnv(),
    )
    const body = await response.json()

    expect(body).toEqual({ ok: true, configured: false, mode: 'mock' })
    expect(JSON.stringify(body)).not.toContain('ANTHROPIC')
  })

  it('keeps the safe mock response available when no hosted key is configured', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: '最近考试压力很大' }] }),
      }),
      createEnv(),
    )
    const body = (await response.json()) as { mode: string; message: { content: string } }

    expect(body.mode).toBe('mock')
    expect(body.message.content.length).toBeGreaterThan(0)
  })

  it('serves the single-page app for browser routes', async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValueOnce(new Response('missing', { status: 404 }))
        .mockResolvedValueOnce(new Response('index page', { status: 200 })),
    }
    const response = await handleWorkerRequest(
      new Request('https://example.com/cases/test-anxiety-adolescent'),
      { ...createEnv(), ASSETS: assets },
    )

    expect(await response.text()).toBe('index page')
    expect(assets.fetch).toHaveBeenCalledTimes(2)
  })
  it('marks an unavailable upstream while keeping the existing fallback JSON contract', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('unavailable', { status: 503 }))
    const response = await handleWorkerRequest(
      new Request('https://example.com/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: '最近工作压力比较大' }] }),
      }),
      { ...createEnv(), ANTHROPIC_AUTH_TOKEN: 'test-placeholder-token' },
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('X-Chat-Fallback')).toBe('upstream')
    expect(await response.json()).toMatchObject({
      mode: 'mock',
      message: { content: expect.any(String) },
    })
  })
})
