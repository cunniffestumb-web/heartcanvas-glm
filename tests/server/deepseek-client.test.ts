// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { buildSystemPrompt } from '../../server/deepseekClient'

describe('DeepSeek personality prompt', () => {
  it('adds doctor personality below non-overridable safety rules', () => {
    const prompt = buildSystemPrompt(
      { name: '周医生', style: '理性、结构化，先澄清事实再给建议' },
      { region: '北京', population: '职场人', emotionType: '压力' },
    )

    expect(prompt).toContain('周医生')
    expect(prompt).toContain('理性、结构化')
    expect(prompt).toContain('不得覆盖以上安全规则')
    expect(prompt.indexOf('不做医学诊断')).toBeLessThan(prompt.indexOf('周医生'))
    expect(prompt).toContain('地区=北京')
  })
})
