import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatContext, ChatInsight, ChatMessage, ChatMode } from '@shared/chat'
import { builtInDoctors } from '@/data/doctors'
import { loadConsultationState, saveConsultationState } from '@/services/conversationStorage'
import { createLocalReply, detectClientCrisis, getChatHealth, sendChatRequest } from '@/services/chatService'
import type { ConsultationSession, DoctorProfile, PersistedConsultationState } from '@/types/consultation'

const now = () => new Date().toISOString()
const createId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
const emptyInsight = (): ChatInsight => ({ emotion: '等待倾听', riskLevel: '低', keywords: ['心理支持'] })

function greeting(doctor: DoctorProfile): ChatMessage {
  return {
    id: createId(),
    role: 'assistant',
    content: `你好，我是${doctor.name}。${doctor.description}你可以从最近最困扰你的一件事说起。这里不会给出医学诊断，我们会一起寻找一个更小、更可行的下一步。`,
    createdAt: now(),
    ...emptyInsight(),
  }
}

function createSession(doctor: DoctorProfile, context: ChatContext = {}): ConsultationSession {
  const timestamp = now()
  return {
    id: createId(),
    title: '新的支持对话',
    createdAt: timestamp,
    updatedAt: timestamp,
    doctorId: doctor.id,
    context,
    insight: emptyInsight(),
    messages: [greeting(doctor)],
  }
}

function autoTitle(content: string): string {
  return content.split(/[，。！？!?\n]/u)[0].trim().slice(0, 16) || '新的支持对话'
}

export const useConsultationStore = defineStore('consultation', () => {
  const storage = typeof localStorage === 'undefined' ? null : localStorage
  const restored = storage ? loadConsultationState(storage) : null
  const fallbackSession = createSession(builtInDoctors[0])
  const sessions = ref<ConsultationSession[]>(restored?.sessions || [fallbackSession])
  const activeSessionId = ref(restored?.activeSessionId || sessions.value[0].id)
  const customDoctors = ref<DoctorProfile[]>(restored?.customDoctors || [])
  const mode = ref<ChatMode>('mock')
  const configured = ref(false)
  const isSending = ref(false)

  const doctorProfiles = computed(() => [...builtInDoctors, ...customDoctors.value])
  const activeSession = computed(() => sessions.value.find((session) => session.id === activeSessionId.value) || sessions.value[0])
  const selectedDoctor = computed(() => doctorProfiles.value.find((doctor) => doctor.id === activeSession.value.doctorId) || builtInDoctors[0])
  const messages = computed(() => activeSession.value.messages)
  const context = computed(() => activeSession.value.context)
  const insight = computed(() => activeSession.value.insight)
  const hasCrisis = computed(() => insight.value.riskLevel === '高')

  function persist() {
    if (!storage) return
    const state: PersistedConsultationState = {
      version: 1,
      activeSessionId: activeSessionId.value,
      sessions: sessions.value,
      customDoctors: customDoctors.value,
    }
    saveConsultationState(state, storage)
  }

  async function initialize() {
    const health = await getChatHealth()
    configured.value = health.configured
    mode.value = health.mode
  }

  function setContext(next: ChatContext) {
    activeSession.value.context = next
    persist()
  }

  function startNewSession() {
    const session = createSession(selectedDoctor.value, { ...context.value })
    sessions.value.unshift(session)
    activeSessionId.value = session.id
    persist()
  }

  function selectSession(id: string) {
    if (!sessions.value.some((session) => session.id === id)) return
    activeSessionId.value = id
    persist()
  }

  function renameSession(id: string, title: string) {
    const session = sessions.value.find((item) => item.id === id)
    const trimmed = title.trim().slice(0, 30)
    if (!session || !trimmed) return
    session.title = trimmed
    session.updatedAt = now()
    persist()
  }

  function deleteSession(id: string) {
    if (!sessions.value.some((session) => session.id === id)) return
    sessions.value = sessions.value.filter((session) => session.id !== id)
    if (sessions.value.length === 0) sessions.value = [createSession(builtInDoctors[0])]
    if (!sessions.value.some((session) => session.id === activeSessionId.value)) activeSessionId.value = sessions.value[0].id
    persist()
  }

  function setDoctor(id: string) {
    const doctor = doctorProfiles.value.find((item) => item.id === id)
    if (!doctor) return
    activeSession.value.doctorId = doctor.id
    if (activeSession.value.messages.length === 1 && activeSession.value.messages[0].role === 'assistant') {
      activeSession.value.messages = [greeting(doctor)]
    }
    activeSession.value.updatedAt = now()
    persist()
  }

  function saveCustomDoctor(profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }) {
    const id = profile.id || `custom-${createId()}`
    const doctor: DoctorProfile = {
      ...profile,
      id,
      name: profile.name.trim().slice(0, 20) || '自定义医生',
      title: profile.title.trim().slice(0, 20) || '专属陪伴',
      description: profile.description.trim().slice(0, 100),
      instruction: profile.instruction.trim().slice(0, 300),
      custom: true,
    }
    const index = customDoctors.value.findIndex((item) => item.id === id)
    if (index >= 0) customDoctors.value[index] = doctor
    else customDoctors.value.push(doctor)
    setDoctor(id)
    persist()
    return doctor
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isSending.value) return

    const shouldTitle = activeSession.value.messages.every((message) => message.role !== 'user')
    const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed, createdAt: now() }
    activeSession.value.messages.push(userMessage)
    if (shouldTitle) activeSession.value.title = autoTitle(trimmed)
    activeSession.value.updatedAt = now()
    isSending.value = true
    persist()

    try {
      const response = detectClientCrisis(trimmed)
        ? createLocalReply(trimmed)
        : await sendChatRequest({
            messages: activeSession.value.messages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
            context: context.value,
            persona: { name: selectedDoctor.value.name, style: selectedDoctor.value.instruction },
          })

      mode.value = response.mode
      activeSession.value.insight = {
        emotion: response.message.emotion,
        riskLevel: response.message.riskLevel,
        keywords: response.message.keywords,
      }
      activeSession.value.messages.push({
        id: createId(),
        role: 'assistant',
        content: response.message.content,
        createdAt: now(),
        ...activeSession.value.insight,
      })
      activeSession.value.updatedAt = now()
      persist()
    } finally {
      isSending.value = false
    }
  }

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    mode,
    configured,
    isSending,
    context,
    insight,
    hasCrisis,
    doctorProfiles,
    selectedDoctor,
    initialize,
    setContext,
    sendMessage,
    startNewSession,
    selectSession,
    renameSession,
    deleteSession,
    setDoctor,
    saveCustomDoctor,
  }
})
