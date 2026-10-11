import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatContext, ChatInsight, ChatMessage, ChatMode } from '@shared/chat'
import { builtInDoctors } from '@/data/doctors'
import { loadConsultationState, saveConsultationState } from '@/services/conversationStorage'
import {
  ChatRequestError,
  createLocalReply,
  detectClientCrisis,
  getChatHealth,
  sendChatRequest,
} from '@/services/chatService'
import type {
  ConsultationSession,
  DoctorProfile,
  PersistedConsultationState,
} from '@/types/consultation'

const now = () => new Date().toISOString()
const createId = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
const emptyInsight = (): ChatInsight => ({ emotion: '等待倾听', riskLevel: '低', keywords: [] })
const greeting = (doctor: DoctorProfile): ChatMessage => ({
  id: createId(),
  role: 'assistant',
  content: `你好，我是${doctor.name}。${doctor.description}你可以从最近最困扰你的一件事说起。`,
  createdAt: now(),
  assistantName: doctor.name,
})
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
    draft: '',
  }
}
interface RequestState {
  status: 'idle' | 'sending' | 'error' | 'cancelled'
  error: string
  retryMessageId?: string
  fallbackMessageId?: string
}
const idleState = (): RequestState => ({ status: 'idle', error: '' })

export const useConsultationStore = defineStore('consultation', () => {
  let storage: Storage | null = null
  try {
    storage = typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    /* Storage can be blocked by the browser. */
  }
  const restored = storage ? loadConsultationState(storage) : null
  const sessions = ref<ConsultationSession[]>(
    restored?.sessions || [createSession(builtInDoctors[0]!)],
  )
  const activeSessionId = ref(restored?.activeSessionId || sessions.value[0]!.id)
  const customDoctors = ref<DoctorProfile[]>(restored?.customDoctors || [])
  const serviceMode = ref<ChatMode>('mock')
  const configured = ref(false)
  const storageWarning = ref('')
  const requestStates = ref<Record<string, RequestState>>({})
  const controllers = new Map<string, AbortController>()
  const doctorProfiles = computed(() => [...builtInDoctors, ...customDoctors.value])
  const activeSession = computed(
    () =>
      sessions.value.find((session) => session.id === activeSessionId.value) || sessions.value[0]!,
  )
  const selectedDoctor = computed(
    () =>
      doctorProfiles.value.find((doctor) => doctor.id === activeSession.value.doctorId) ||
      builtInDoctors[0]!,
  )
  const messages = computed(() => activeSession.value.messages)
  const context = computed(() => activeSession.value.context)
  const insight = computed(() => activeSession.value.insight)
  const hasUserMessages = computed(() => messages.value.some((message) => message.role === 'user'))
  const hasCrisis = computed(() => hasUserMessages.value && insight.value.riskLevel === '高')
  const activeRequest = computed(() => requestStates.value[activeSessionId.value] || idleState())
  const isSending = computed(() => activeRequest.value.status === 'sending')
  const mode = computed(() => activeSession.value.mode || serviceMode.value)
  const draft = computed(() => activeSession.value.draft || '')

  function persist() {
    if (!storage) {
      storageWarning.value = '此浏览器无法保存记录，当前对话仍可继续。'
      return
    }
    try {
      const state: PersistedConsultationState = {
        version: 1,
        activeSessionId: activeSessionId.value,
        sessions: sessions.value,
        customDoctors: customDoctors.value,
      }
      saveConsultationState(state, storage)
      storageWarning.value = ''
    } catch {
      storageWarning.value = '设备暂时无法保存记录，当前对话仍可继续；请勿刷新页面。'
    }
  }
  async function initialize() {
    const health = await getChatHealth()
    configured.value = health.configured
    serviceMode.value = health.mode
  }
  function setContext(next: ChatContext) {
    activeSession.value.context = next
    persist()
  }
  function setDraft(value: string) {
    activeSession.value.draft = value.slice(0, 4000)
    persist()
  }
  function startNewSession(nextContext: ChatContext = { ...context.value }) {
    const session = createSession(selectedDoctor.value, nextContext)
    sessions.value.unshift(session)
    activeSessionId.value = session.id
    persist()
    return session.id
  }
  function selectSession(id: string) {
    if (sessions.value.some((session) => session.id === id)) {
      activeSessionId.value = id
      persist()
    }
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
    controllers.get(id)?.abort()
    controllers.delete(id)
    delete requestStates.value[id]
    sessions.value = sessions.value.filter((session) => session.id !== id)
    if (!sessions.value.length) sessions.value = [createSession(builtInDoctors[0]!)]
    if (!sessions.value.some((session) => session.id === activeSessionId.value))
      activeSessionId.value = sessions.value[0]!.id
    persist()
  }
  function setDoctor(id: string) {
    const doctor = doctorProfiles.value.find((item) => item.id === id)
    if (!doctor) return
    activeSession.value.doctorId = id
    if (!hasUserMessages.value) activeSession.value.messages = [greeting(doctor)]
    activeSession.value.updatedAt = now()
    persist()
  }
  function saveCustomDoctor(profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }) {
    const id = profile.id || `custom-${createId()}`
    const doctor: DoctorProfile = {
      ...profile,
      id,
      name: profile.name.trim().slice(0, 20) || '自定义陪伴',
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
  function appendReply(
    session: ConsultationSession,
    user: ChatMessage,
    doctor: DoctorProfile,
    response: ReturnType<typeof createLocalReply>,
  ) {
    session.mode = response.mode
    session.insight = {
      emotion: response.message.emotion,
      riskLevel: response.message.riskLevel,
      keywords: response.message.keywords,
    }
    const message: ChatMessage = {
      id: createId(),
      role: 'assistant',
      content: response.message.content,
      createdAt: now(),
      ...session.insight,
      assistantName: doctor.name,
      sourceMode: response.mode,
      inReplyTo: user.id,
    }
    session.messages.push(message)
    session.updatedAt = now()
    return message.id
  }
  async function executeRequest(sessionId: string, userMessage: ChatMessage) {
    const session = sessions.value.find((item) => item.id === sessionId)
    if (!session || requestStates.value[sessionId]?.status === 'sending') return
    const doctor = {
      ...(doctorProfiles.value.find((item) => item.id === session.doctorId) || builtInDoctors[0]!),
    }
    const controller = new AbortController()
    controllers.set(sessionId, controller)
    requestStates.value[sessionId] = { status: 'sending', error: '' }
    const sourceContext = { ...session.context }
    const userIndex = session.messages.findIndex((message) => message.id === userMessage.id)
    const history = session.messages
      .slice(0, userIndex + 1)
      .map(({ role, content }) => ({ role, content }))
    persist()
    try {
      const response = detectClientCrisis(userMessage.content)
        ? createLocalReply(userMessage.content)
        : await sendChatRequest(
            {
              messages: history,
              context: sourceContext,
              persona: { name: doctor.name, style: doctor.instruction },
            },
            fetch,
            { signal: controller.signal },
          )
      if (
        controller.signal.aborted ||
        controllers.get(sessionId) !== controller ||
        !sessions.value.some((item) => item.id === sessionId)
      )
        return
      const replyId = appendReply(session, userMessage, doctor, response)
      requestStates.value[sessionId] =
        'unavailable' in response && response.unavailable
          ? {
              status: 'error',
              error: '在线回应暂时不可用，已提供基础支持。你可以稍后重试。',
              retryMessageId: userMessage.id,
              fallbackMessageId: replyId,
            }
          : idleState()
      persist()
    } catch (error) {
      if (
        controllers.get(sessionId) !== controller ||
        !sessions.value.some((item) => item.id === sessionId)
      )
        return
      const cancelled =
        controller.signal.aborted ||
        (error instanceof ChatRequestError && error.kind === 'cancelled')
      if (cancelled)
        requestStates.value[sessionId] = {
          status: 'cancelled',
          error: '已停止回应，可以重试。',
          retryMessageId: userMessage.id,
        }
      else if (error instanceof ChatRequestError && error.kind === 'input')
        requestStates.value[sessionId] = {
          status: 'error',
          error: error.message,
          retryMessageId: userMessage.id,
        }
      else {
        const replyId = appendReply(
          session,
          userMessage,
          doctor,
          createLocalReply(userMessage.content),
        )
        requestStates.value[sessionId] = {
          status: 'error',
          error: `${error instanceof Error ? error.message : '在线回应暂时不可用。'} 已提供基础支持。`,
          retryMessageId: userMessage.id,
          fallbackMessageId: replyId,
        }
      }
      persist()
    } finally {
      if (controllers.get(sessionId) === controller) {
        controllers.delete(sessionId)
        if (requestStates.value[sessionId]?.status === 'sending')
          requestStates.value[sessionId] = idleState()
      }
    }
  }
  async function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isSending.value) return
    const session = activeSession.value
    if (trimmed.length > 4000) {
      requestStates.value[session.id] = {
        status: 'error',
        error: '消息最多支持4000个字符，请缩短后发送。',
      }
      return
    }
    const shouldTitle = !hasUserMessages.value
    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      createdAt: now(),
    }
    session.messages.push(userMessage)
    session.draft = ''
    session.updatedAt = now()
    if (shouldTitle)
      session.title =
        trimmed
          .split(/[，。！？!?\n]/u)[0]!
          .trim()
          .slice(0, 16) || '新的支持对话'
    await executeRequest(session.id, userMessage)
  }
  async function retryMessage(sessionId = activeSessionId.value) {
    const session = sessions.value.find((item) => item.id === sessionId)
    const state = requestStates.value[sessionId]
    const message = session?.messages.find(
      (item) => item.id === state?.retryMessageId && item.role === 'user',
    )
    if (!session || !message || state?.status === 'sending') return
    if (state?.fallbackMessageId)
      session.messages = session.messages.filter((item) => item.id !== state.fallbackMessageId)
    await executeRequest(sessionId, message)
  }
  function cancelRequest(sessionId = activeSessionId.value) {
    const controller = controllers.get(sessionId)
    if (!controller) return
    const user = sessions.value
      .find((session) => session.id === sessionId)
      ?.messages.slice()
      .reverse()
      .find((message) => message.role === 'user')
    requestStates.value[sessionId] = {
      status: 'cancelled',
      error: '已停止回应，可以重试。',
      retryMessageId: user?.id,
    }
    controller.abort()
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
    hasUserMessages,
    doctorProfiles,
    selectedDoctor,
    draft,
    activeRequest,
    storageWarning,
    initialize,
    setContext,
    setDraft,
    sendMessage,
    retryMessage,
    cancelRequest,
    startNewSession,
    selectSession,
    renameSession,
    deleteSession,
    setDoctor,
    saveCustomDoctor,
  }
})
