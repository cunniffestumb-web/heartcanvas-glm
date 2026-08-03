export type ChatRole = 'user' | 'assistant' | 'system'
export type RiskLevel = '低' | '中' | '高'
export type ChatMode = 'online' | 'mock'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  emotion?: string
  riskLevel?: RiskLevel
  keywords?: string[]
}

export interface ChatInsight {
  emotion: string
  riskLevel: RiskLevel
  keywords: string[]
}

export interface ChatContext {
  region?: string
  population?: string
  emotionType?: string
}

export interface ChatRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[]
  context?: ChatContext
}

export interface SupportMessage extends ChatInsight {
  content: string
}

export interface ChatResponse {
  mode: ChatMode
  message: SupportMessage
}
