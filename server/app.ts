import express, { type Request, type Response } from 'express'
import type { ChatRequest } from '../shared/chat.js'
import { getProviderConfig } from './config.js'
import { createDeepSeekProvider, type SupportProvider } from './deepseekClient.js'
import { createMockReply } from './mockReply.js'
import { detectCrisis } from './safety.js'

interface ApiAppOptions {
  provider?: SupportProvider | null
}

function resolveProvider(options: ApiAppOptions): SupportProvider | null {
  if ('provider' in options) return options.provider || null
  const config = getProviderConfig()
  return config ? createDeepSeekProvider(config) : null
}

function getLatestUserMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const messages = (body as Partial<ChatRequest>).messages
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) return null
  const latest = [...messages].reverse().find((message) => message?.role === 'user')
  if (!latest || typeof latest.content !== 'string') return null
  const content = latest.content.trim()
  return content.length > 0 && content.length <= 4000 ? content : null
}

export function createApiApp(options: ApiAppOptions = {}) {
  const app = express()
  const provider = resolveProvider(options)

  app.disable('x-powered-by')
  app.use(express.json({ limit: '32kb' }))

  app.get('/api/health', (_request: Request, response: Response) => {
    response.json({
      ok: true,
      configured: Boolean(provider),
      mode: provider ? 'online' : 'mock',
    })
  })

  app.post('/api/chat', async (request: Request, response: Response) => {
    const latestUserText = getLatestUserMessage(request.body)
    if (!latestUserText) {
      response.status(400).json({ error: '请输入 1 到 4000 个字符的有效消息。' })
      return
    }

    if (detectCrisis(latestUserText)) {
      response.json(createMockReply(latestUserText))
      return
    }

    if (!provider) {
      response.json(createMockReply(latestUserText))
      return
    }

    try {
      const message = await provider.reply(request.body as ChatRequest)
      response.json({ mode: 'online', message })
    } catch {
      console.warn('[chat] 上游模型暂时不可用，已切换演示模式。')
      response.json(createMockReply(latestUserText))
    }
  })

  app.use((_request: Request, response: Response) => {
    response.status(404).json({ error: 'Not found' })
  })

  return app
}

export type { SupportProvider }
