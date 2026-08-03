import type { ChatResponse } from '../shared/chat.js'
import { analyzeEmotion, detectCrisis } from './safety.js'

const crisisContent = '我很担心你现在的安全。如果你可能马上伤害自己或别人，请立即联系当地急救电话、附近医院急诊，或让身边可信赖的人陪在你身边。这个平台不能替代紧急救助。请尽量远离可能伤害自己的物品，并把你此刻的情况直接告诉那位可信赖的人。'

export function createMockReply(text: string): ChatResponse {
  if (detectCrisis(text)) {
    return {
      mode: 'mock',
      message: {
        content: crisisContent,
        emotion: '危机',
        riskLevel: '高',
        keywords: ['安全风险', '立即求助'],
      },
    }
  }

  const insight = analyzeEmotion(text)
  const focus = insight.keywords.join('、')
  return {
    mode: 'mock',
    message: {
      ...insight,
      content: `听起来你正同时承受着${focus}带来的消耗，这种紧绷感值得被认真对待。先把今天要处理的事情缩小到一步：停下来做几次缓慢呼吸，再写下此刻最担心的一件事和下一步能完成的小行动。你不需要一次解决所有问题。如果这种状态持续两周以上、明显影响睡眠和生活，或让你感到难以独自承受，建议联系专业心理咨询师或学校、社区的心理服务。`,
    },
  }
}
