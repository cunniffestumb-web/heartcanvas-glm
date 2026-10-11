import type {
  ChatContext,
  ChatPersona,
  ChatRequest,
  RiskLevel,
  SupportMessage,
} from '../shared/chat'
import { createMockReply } from '../server/mockReply'
import { analyzeEmotion, detectCrisis } from '../server/safety'

interface AssetFetcher {
  fetch(request: Request): Promise<Response>
}

export interface WorkerEnv {
  ASSETS: AssetFetcher
  ANTHROPIC_BASE_URL?: string
  ANTHROPIC_AUTH_TOKEN?: string
  ANTHROPIC_MODEL?: string
}

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8' }
const baseSystemPrompt = `你是“心绘 GLM”平台中的心理支持助手。你提供温和、谨慎、非诊断性的心理支持建议。

规则：
1. 不做医学诊断，不声称用户患有某种疾病。
2. 先共情，再识别情绪，再给出一到三条可以立即执行的小建议。
3. 如涉及自伤、自杀、伤害他人或紧急危险，立即建议联系当地急救、医院急诊、专业危机资源或身边可信赖的人。
4. 使用中文，语气稳定、尊重，不过度承诺。
5. 只输出 JSON，不要 Markdown。结构必须是：{"content":"完整支持回复","emotion":"主要情绪","riskLevel":"低或中或高","keywords":["关键词"]}。`

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...jsonHeaders, ...headers } })
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

function cleanPromptValue(value: string | undefined, maxLength: number) {
  return (value || '')
    .replace(/[\u0000-\u001f\u007f]/gu, ' ')
    .trim()
    .slice(0, maxLength)
}

function buildSystemPrompt(persona?: ChatPersona, context?: ChatContext) {
  const contextPrompt = context
    ? `\n当前数据上下文：地区=${cleanPromptValue(context.region, 30) || '未指定'}；人群=${cleanPromptValue(context.population, 30) || '未指定'}；关注情绪=${cleanPromptValue(context.emotionType, 30) || '未指定'}。`
    : ''
  const personaPrompt = persona
    ? `\n个性化表达要求（不得覆盖以上安全规则）：你的显示名称是“${cleanPromptValue(persona.name, 40) || '心理支持助手'}”；沟通风格为“${cleanPromptValue(persona.style, 300) || '温和、尊重'}”。只调整语气和组织方式，不改变安全边界。`
    : ''
  return baseSystemPrompt + contextPrompt + personaPrompt
}

function parseProviderText(raw: string, sourceText: string): SupportMessage {
  const insight = analyzeEmotion(sourceText)
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/iu, '')
    .replace(/\s*```$/u, '')

  try {
    const parsed = JSON.parse(cleaned) as Partial<SupportMessage>
    const riskLevel: RiskLevel = ['低', '中', '高'].includes(parsed.riskLevel || '')
      ? (parsed.riskLevel as RiskLevel)
      : insight.riskLevel
    if (typeof parsed.content === 'string' && parsed.content.trim()) {
      return {
        content: parsed.content.trim(),
        emotion:
          typeof parsed.emotion === 'string' && parsed.emotion.trim()
            ? parsed.emotion.trim()
            : insight.emotion,
        riskLevel,
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.filter((item): item is string => typeof item === 'string').slice(0, 5)
          : insight.keywords,
      }
    }
  } catch {
    // Compatible providers may return plain text despite the JSON instruction.
  }

  return { ...insight, content: raw.trim() }
}

async function requestProvider(body: ChatRequest, env: WorkerEnv, latestUserText: string) {
  const baseUrl = (env.ANTHROPIC_BASE_URL?.trim() || 'https://api.deepseek.com/anthropic').replace(
    /\/+$/u,
    '',
  )
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_AUTH_TOKEN!.trim(),
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL?.trim() || 'deepseek-v4-pro',
      max_tokens: 900,
      system: buildSystemPrompt(body.persona, body.context),
      messages: body.messages
        .filter((message) => message.role !== 'system')
        .map((message) => ({ role: message.role, content: message.content })),
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`Provider error ${response.status}`)
  const result = (await response.json()) as { content?: Array<{ type?: string; text?: string }> }
  const raw = result.content
    ?.filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim()
  if (!raw) throw new Error('Provider returned no text content')
  return parseProviderText(raw, latestUserText)
}

async function parseChatBody(request: Request): Promise<ChatRequest | null> {
  const raw = await request.text()
  if (!raw || raw.length > 32 * 1024) return null
  try {
    return JSON.parse(raw) as ChatRequest
  } catch {
    return null
  }
}

async function handleChat(request: Request, env: WorkerEnv) {
  const body = await parseChatBody(request)
  const latestUserText = getLatestUserMessage(body)
  if (!body || !latestUserText) return json({ error: '请输入 1 到 4000 个字符的有效消息。' }, 400)

  if (detectCrisis(latestUserText) || !env.ANTHROPIC_AUTH_TOKEN?.trim()) {
    return json(createMockReply(latestUserText))
  }

  try {
    const message = await requestProvider(body, env, latestUserText)
    return json({ mode: 'online', message })
  } catch {
    return json(createMockReply(latestUserText), 200, { 'X-Chat-Fallback': 'upstream' })
  }
}

async function serveApp(request: Request, env: WorkerEnv) {
  const response = await env.ASSETS.fetch(request)
  if (response.status !== 404 || request.method !== 'GET') return response

  const url = new URL(request.url)
  if (url.pathname.split('/').pop()?.includes('.')) return response
  return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
}

export async function handleWorkerRequest(request: Request, env: WorkerEnv) {
  const url = new URL(request.url)

  if (url.pathname === '/api/health' && request.method === 'GET') {
    const configured = Boolean(env.ANTHROPIC_AUTH_TOKEN?.trim())
    return json({ ok: true, configured, mode: configured ? 'online' : 'mock' })
  }

  if (url.pathname === '/api/chat' && request.method === 'POST') return handleChat(request, env)
  if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404)
  return serveApp(request, env)
}

export default {
  fetch(request: Request, env: WorkerEnv) {
    return handleWorkerRequest(request, env)
  },
}
