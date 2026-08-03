import type { ChatInsight } from '../shared/chat.js'

const crisisTerms = [
  '自杀',
  '想死',
  '不想活',
  '活不下去',
  '结束生命',
  '伤害自己',
  '伤害别人',
  '杀了他',
]

const keywordGroups = [
  { label: '焦虑', terms: ['焦虑', '紧张', '害怕', '担心', '恐慌'] },
  { label: '低落', terms: ['难过', '低落', '没意义', '想哭', '沮丧'] },
  { label: '压力', terms: ['压力', '任务', '工作', '加班'] },
  { label: '考试', terms: ['考试', '复习', '成绩'] },
  { label: '睡眠', terms: ['睡不着', '失眠', '睡不好', '疲惫'] },
  { label: '人际', terms: ['人际', '同学', '同事', '关系', '争吵'] },
  { label: '孤独', terms: ['孤独', '没人理解', '一个人'] },
]

export function detectCrisis(text: string): boolean {
  const normalized = text.replace(/\s+/g, '')
  return crisisTerms.some((term) => normalized.includes(term))
}

export function analyzeEmotion(text: string): ChatInsight {
  if (detectCrisis(text)) {
    return { emotion: '危机', riskLevel: '高', keywords: ['安全风险'] }
  }

  const matches = keywordGroups
    .filter((group) => group.terms.some((term) => text.includes(term)))
    .map((group) => group.label)

  const emotion = matches.includes('焦虑')
    ? '焦虑'
    : matches.includes('低落')
      ? '低落'
      : matches.includes('压力') || matches.includes('考试')
        ? '压力'
        : matches.includes('睡眠')
          ? '睡眠困扰'
          : matches.includes('孤独')
            ? '孤独'
            : '需要关注'

  const riskLevel = matches.length >= 2 ? '中' : '低'
  return {
    emotion,
    riskLevel,
    keywords: matches.length > 0 ? matches.slice(0, 4) : ['情绪支持'],
  }
}
