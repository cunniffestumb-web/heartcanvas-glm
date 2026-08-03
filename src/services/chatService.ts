import type { ChatInsight, ChatRequest, ChatResponse, RiskLevel } from '@shared/chat'

const crisisTerms = ['自杀', '想死', '不想活', '活不下去', '结束生命', '伤害自己', '伤害别人']
const groups = [
  { label: '焦虑', terms: ['焦虑', '紧张', '害怕', '担心', '恐慌'] },
  { label: '低落', terms: ['难过', '低落', '没意义', '想哭', '沮丧'] },
  { label: '压力', terms: ['压力', '任务', '工作', '加班'] },
  { label: '考试', terms: ['考试', '复习', '成绩'] },
  { label: '睡眠', terms: ['睡不着', '失眠', '睡不好', '疲惫'] },
  { label: '人际', terms: ['人际', '同学', '同事', '关系', '争吵'] },
]

export function detectClientCrisis(text: string) {
  return crisisTerms.some((term) => text.replace(/\s+/g, '').includes(term))
}

function analyzeClientText(text: string): ChatInsight {
  if (detectClientCrisis(text)) return { emotion: '危机', riskLevel: '高', keywords: ['安全风险', '立即求助'] }
  const matches = groups.filter((group) => group.terms.some((term) => text.includes(term))).map((group) => group.label)
  const emotion = matches.includes('焦虑') ? '焦虑' : matches.includes('低落') ? '低落' : matches.includes('压力') || matches.includes('考试') ? '压力' : matches.includes('睡眠') ? '睡眠困扰' : '需要关注'
  const riskLevel: RiskLevel = matches.length >= 2 ? '中' : '低'
  return { emotion, riskLevel, keywords: matches.length ? matches.slice(0, 4) : ['情绪支持'] }
}

export function createLocalReply(text: string): ChatResponse {
  const insight = analyzeClientText(text)
  if (insight.riskLevel === '高') {
    return {
      mode: 'mock',
      message: {
        ...insight,
        content: '我很担心你现在的安全。如果你可能马上伤害自己或别人，请立即联系当地急救电话、附近医院急诊，或请身边可信赖的人陪着你。这个平台不能替代紧急救助。请尽量远离可能造成伤害的物品，并把现在的情况直接告诉那位可信赖的人。',
      },
    }
  }

  return {
    mode: 'mock',
    message: {
      ...insight,
      content: `听起来你正在承受${insight.keywords.join('、')}带来的消耗。先不用急着解决所有事情，可以把眼前目标缩小到一个小步骤：做几次缓慢呼吸，写下最担心的一件事，再选择今天能完成的一项行动。如果这种状态持续两周以上或明显影响生活，建议联系专业心理咨询师或当地心理服务。`,
    },
  }
}

export async function getChatHealth(fetcher: typeof fetch = fetch) {
  try {
    const response = await fetcher('/api/health', { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('Health check failed')
    return await response.json() as { ok: boolean; configured: boolean; mode: 'online' | 'mock' }
  } catch {
    return { ok: false, configured: false, mode: 'mock' as const }
  }
}

export async function sendChatRequest(request: ChatRequest, fetcher: typeof fetch = fetch): Promise<ChatResponse> {
  const latest = [...request.messages].reverse().find((message) => message.role === 'user')?.content || ''
  try {
    const response = await fetcher('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Chat request failed')
    return await response.json() as ChatResponse
  } catch {
    return createLocalReply(latest)
  }
}
