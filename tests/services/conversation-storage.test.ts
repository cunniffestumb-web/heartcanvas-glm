import { beforeEach, describe, expect, it } from 'vitest'
import { loadConsultationState, saveConsultationState } from '@/services/conversationStorage'
import type { PersistedConsultationState } from '@/types/consultation'

const state: PersistedConsultationState = {
  version: 1,
  activeSessionId: 'session-1',
  customDoctors: [],
  sessions: [{
    id: 'session-1',
    title: '工作压力',
    createdAt: '2026-08-04T00:00:00.000Z',
    updatedAt: '2026-08-04T00:00:00.000Z',
    doctorId: 'warm',
    context: {},
    insight: { emotion: '压力', riskLevel: '中', keywords: ['工作'] },
    messages: [{ id: 'message-1', role: 'user', content: '工作压力很大', createdAt: '2026-08-04T00:00:00.000Z' }],
  }],
}

describe('conversation storage', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips versioned consultation sessions', () => {
    saveConsultationState(state, localStorage)

    expect(loadConsultationState(localStorage)).toEqual(state)
  })

  it('ignores malformed or unsupported persisted data', () => {
    localStorage.setItem('xinhui-consultation', '{bad json')
    expect(loadConsultationState(localStorage)).toBeNull()

    localStorage.setItem('xinhui-consultation', JSON.stringify({ ...state, version: 2 }))
    expect(loadConsultationState(localStorage)).toBeNull()
  })
})
