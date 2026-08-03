import { describe, expect, it } from 'vitest'
import { createMockReply } from '../../server/mockReply'

describe('mock psychological support reply', () => {
  it('returns an actionable non-diagnostic support response', () => {
    const response = createMockReply('工作任务太多，我很焦虑，晚上睡不好')

    expect(response.mode).toBe('mock')
    expect(response.message.emotion).toBe('焦虑')
    expect(response.message.riskLevel).toBe('中')
    expect(response.message.content).toContain('先把今天要处理的事情缩小到一步')
    expect(response.message.content).toContain('专业心理咨询师')
  })

  it('replaces ordinary analysis with immediate safety guidance for crisis language', () => {
    const response = createMockReply('我活不下去了，想伤害自己')

    expect(response.message.riskLevel).toBe('高')
    expect(response.message.content).toContain('立即联系当地急救电话')
    expect(response.message.content).toContain('可信赖的人')
    expect(response.message.content).not.toContain('可能压力来源')
  })
})
