import type { ChatContext, ChatInsight, ChatMessage } from '@shared/chat'

export type VoicePreference = 'female' | 'male' | 'neutral'

export interface DoctorProfile {
  id: string
  name: string
  title: string
  description: string
  instruction: string
  voicePreference: VoicePreference
  voiceURI?: string
  custom: boolean
}

export interface ConsultationSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  doctorId: string
  context: ChatContext
  insight: ChatInsight
  messages: ChatMessage[]
}

export interface PersistedConsultationState {
  version: 1
  activeSessionId: string
  sessions: ConsultationSession[]
  customDoctors: DoctorProfile[]
}
