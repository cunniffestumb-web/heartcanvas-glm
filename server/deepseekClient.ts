import Anthropic from '@anthropic-ai/sdk'
import type { ChatContext, ChatPersona, ChatRequest, RiskLevel, SupportMessage } from '../shared/chat.js'
import type { ProviderConfig } from './config.js'
import { analyzeEmotion } from './safety.js'

export interface SupportProvider {
  reply(request: ChatRequest): Promise<SupportMessage>
}

const baseSystemPrompt = `你是“心绘 GLM”平台中的心理支持助手。你提供温和、谨慎、非诊断性的心理支持建议。

规则：
1. 不做医学诊断，不声称用户患有某种疾病。
2. 先共情，再识别情绪，再给出一到三条可以立即执行的小建议。
3. 如涉及自伤、自杀、伤害他人或紧急危险，立即建议联系当地急救、医院急诊、专业危机资源或身边可信赖的人。
4. 使用中文，语气稳定、尊重，不过度承诺。
5. 只输出 JSON，不要 Markdown。结构必须是：{"content":"完整支持回复","emotion":"主要情绪","riskLevel":"低或中或高","keywords":["关键词"]}。`

function cleanPromptValue(value: string | undefined, maxLength: number): string {
  return (value || '').replace(/[\u0000-\u001f\u007f]/gu, ' ').trim().slice(0, maxLength)
}

export function buildSystemPrompt(persona?: ChatPersona, context?: ChatContext): string {
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
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')

  try {
    const parsed = JSON.parse(cleaned) as Partial<SupportMessage>
    const riskLevel: RiskLevel = ['低', '中', '高'].includes(parsed.riskLevel || '')
      ? parsed.riskLevel as RiskLevel
      : insight.riskLevel

    if (typeof parsed.content === 'string' && parsed.content.trim()) {
      return {
        content: parsed.content.trim(),
        emotion: typeof parsed.emotion === 'string' && parsed.emotion.trim() ? parsed.emotion.trim() : insight.emotion,
        riskLevel,
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.filter((item): item is string => typeof item === 'string').slice(0, 5)
          : insight.keywords,
      }
    }
  } catch {
    // Some compatible providers ignore structured-output instructions.
  }

  return {
    ...insight,
    content: raw.trim(),
  }
}

export function createDeepSeekProvider(config: ProviderConfig): SupportProvider {
  const client = new Anthropic({
    apiKey: config.authToken,
    baseURL: config.baseUrl,
    timeout: 20_000,
    maxRetries: 0,
  })

  return {
    async reply(request) {
      const latestUser = [...request.messages].reverse().find((message) => message.role === 'user')
      const response = await client.messages.create({
        model: config.model,
        max_tokens: 900,
        system: buildSystemPrompt(request.persona, request.context),
        messages: request.messages
          .filter((message) => message.role !== 'system')
          .map((message) => ({ role: message.role as 'user' | 'assistant', content: message.content })),
      })
      const raw = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()

      if (!raw) throw new Error('Provider returned no text content')
      return parseProviderText(raw, latestUser?.content || '')
    },
  }
}
