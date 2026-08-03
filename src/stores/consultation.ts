import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatContext, ChatInsight, ChatMessage, ChatMode } from '@shared/chat'
import { createLocalReply, detectClientCrisis, getChatHealth, sendChatRequest } from '@/services/chatService'

const now = () => new Date().toISOString()
const messageId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useConsultationStore = defineStore('consultation', () => {
  const messages = ref<ChatMessage[]>([{
    id: messageId(),
    role: 'assistant',
    content: '你好，我是心绘 GLM 心理支持助手。你可以从最近最困扰你的一件事说起。这里不会给出医学诊断，但会认真听见你的感受，并陪你寻找一个更小、更可行的下一步。',
    createdAt: now(),
    emotion: '等待倾听',
    riskLevel: '低',
    keywords: ['心理支持'],
  }])
  const mode = ref<ChatMode>('mock')
  const configured = ref(false)
  const isSending = ref(false)
  const context = ref<ChatContext>({})
  const insight = ref<ChatInsight>({ emotion: '等待倾听', riskLevel: '低', keywords: ['心理支持'] })

  const hasCrisis = computed(() => insight.value.riskLevel === '高')

  async function initialize() {
    const health = await getChatHealth()
    configured.value = health.configured
    mode.value = health.mode
  }

  function setContext(next: ChatContext) {
    context.value = next
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isSending.value) return

    const userMessage: ChatMessage = { id: messageId(), role: 'user', content: trimmed, createdAt: now() }
    messages.value.push(userMessage)
    isSending.value = true

    const response = detectClientCrisis(trimmed)
      ? createLocalReply(trimmed)
      : await sendChatRequest({
          messages: messages.value.map(({ role, content }) => ({ role, content })),
          context: context.value,
        })

    mode.value = response.mode
    insight.value = {
      emotion: response.message.emotion,
      riskLevel: response.message.riskLevel,
      keywords: response.message.keywords,
    }
    messages.value.push({
      id: messageId(),
      role: 'assistant',
      content: response.message.content,
      createdAt: now(),
      ...insight.value,
    })
    isSending.value = false
  }

  function startNewSession() {
    messages.value = messages.value.slice(0, 1)
    insight.value = { emotion: '等待倾听', riskLevel: '低', keywords: ['心理支持'] }
  }

  return { messages, mode, configured, isSending, context, insight, hasCrisis, initialize, setContext, sendMessage, startNewSession }
})
