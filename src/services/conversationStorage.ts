import type { PersistedConsultationState } from '@/types/consultation'

export const CONSULTATION_STORAGE_KEY = 'xinhui-consultation'

function isValidState(value: unknown): value is PersistedConsultationState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<PersistedConsultationState>
  if (state.version !== 1 || !Array.isArray(state.sessions) || !Array.isArray(state.customDoctors))
    return false
  if (typeof state.activeSessionId !== 'string' || state.sessions.length === 0) return false
  return (
    state.sessions.some((session) => session?.id === state.activeSessionId) &&
    state.sessions.every(
      (session) =>
        typeof session?.id === 'string' &&
        typeof session.title === 'string' &&
        typeof session.doctorId === 'string' &&
        Array.isArray(session.messages) &&
        session.messages.every(
          (message) =>
            typeof message?.id === 'string' &&
            ['user', 'assistant', 'system'].includes(message.role) &&
            typeof message.content === 'string' &&
            typeof message.createdAt === 'string',
        ) &&
        Boolean(session.context && typeof session.context === 'object') &&
        Boolean(
          session.insight &&
            typeof session.insight.emotion === 'string' &&
            ['低', '中', '高'].includes(session.insight.riskLevel) &&
            Array.isArray(session.insight.keywords),
        ),
    )
  )
}

export function loadConsultationState(storage: Storage): PersistedConsultationState | null {
  try {
    const raw = storage.getItem(CONSULTATION_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveConsultationState(state: PersistedConsultationState, storage: Storage): void {
  storage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(state))
}
