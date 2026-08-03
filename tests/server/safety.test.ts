import { describe, expect, it } from 'vitest'
import { analyzeEmotion, detectCrisis } from '../../server/safety'

describe('psychological safety classifier', () => {
  it.each(['我想自杀', '我真的活不下去了', '我可能会伤害自己', '我控制不住想伤害别人']) (
    'flags crisis language before ordinary analysis: %s',
    (text) => {
      expect(detectCrisis(text)).toBe(true)
    },
  )

  it('does not treat ordinary stress as an immediate crisis', () => {
    expect(detectCrisis('最近考试压力很大，整个人很疲惫')).toBe(false)
  })

  it('identifies anxiety with sleep and exam context', () => {
    expect(analyzeEmotion('考试让我很焦虑，晚上总是睡不着')).toEqual({
      emotion: '焦虑',
      riskLevel: '中',
      keywords: ['焦虑', '考试', '睡眠'],
    })
  })
})
